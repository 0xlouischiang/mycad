/**
 * Live 3D preview of a robot: renders each link's tessellated body positioned by
 * forward kinematics. Joint-slider changes only update per-link transforms
 * (Matrix4) — meshes are NOT re-tessellated (architecture req #8 + #4).
 *
 * A dedicated lightweight three.js scene (separate from the Part Studio
 * Viewport) since it draws N transformed bodies rather than one shape.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useStore } from "../store";
import { forwardKinematics } from "../model/kinematics";
import { validateRobot } from "../model/robot";

export function RobotPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameRef = useRef(0);
  /** Per-link three.js group holding the (fixed) mesh; we set its matrix. */
  const linkGroups = useRef<Map<string, THREE.Group>>(new Map());

  const doc = useStore((s) => s.doc);
  const activeRobotId = useStore((s) => s.activeRobotId);
  const robotMeshes = useStore((s) => s.robotMeshes);
  const jointValues = useStore((s) => s.jointValues);
  const computeRobotMeshes = useStore((s) => s.computeRobotMeshes);

  const robot = doc.robots.find((r) => r.id === activeRobotId) ?? null;

  // Set up the three.js scene once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    const { clientWidth: w, clientHeight: h } = container;
    const camera = new THREE.PerspectiveCamera(45, w / h || 1, 0.1, 100000);
    camera.position.set(120, 90, 120);
    camera.up.set(0, 0, 1); // Z-up, matching our world convention
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(1, 1, 1.5);
    scene.add(key);
    scene.add(new THREE.GridHelper(400, 40, 0x444444, 0x2a2a2a).rotateX(Math.PI / 2));
    scene.add(new THREE.AxesHelper(40));

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const ro = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      camera.aspect = rect.width / rect.height || 1;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height);
    });
    ro.observe(container);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  // Fetch link meshes when the robot or its link set changes.
  useEffect(() => {
    void computeRobotMeshes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRobotId, robot?.links.length, computeRobotMeshes]);

  // Rebuild link mesh objects when robotMeshes changes.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !robot) return;
    // Remove stale groups.
    for (const [id, g] of linkGroups.current) {
      if (!robotMeshes[id] || !robot.links.some((l) => l.id === id)) {
        scene.remove(g);
        linkGroups.current.delete(id);
      }
    }
    // Add/refresh groups for current links.
    const palette = [0x4a90d9, 0xd98a4a, 0x6ab04a, 0xb04a9e, 0xb0a24a];
    robot.links.forEach((link, i) => {
      const shape = robotMeshes[link.id];
      if (!shape) return;
      let group = linkGroups.current.get(link.id);
      if (!group) {
        group = new THREE.Group();
        group.matrixAutoUpdate = false; // we drive the matrix from FK
        linkGroups.current.set(link.id, group);
        scene.add(group);
      }
      // (Re)build the mesh child.
      group.clear();
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(shape.mesh.positions, 3));
      geom.setAttribute("normal", new THREE.BufferAttribute(shape.mesh.normals, 3));
      geom.setIndex(new THREE.BufferAttribute(shape.mesh.indices, 1));
      const mat = new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        metalness: 0.1,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(geom, mat));
    });
  }, [robotMeshes, robot]);

  // Apply forward kinematics whenever joint values (or structure) change.
  useEffect(() => {
    if (!robot) return;
    const v = validateRobot(robot);
    if (!v.ok) return; // invalid tree → leave last-good transforms
    const placements = forwardKinematics(robot, v.root, jointValues);
    for (const [id, group] of linkGroups.current) {
      const m = placements.get(id);
      if (m) group.matrix.fromArray(m);
    }
  }, [robot, jointValues, robotMeshes]);

  return <div ref={containerRef} className="h-full w-full" />;
}
