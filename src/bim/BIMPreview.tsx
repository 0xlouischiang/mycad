/**
 * Live 3D preview of a BIM model (Phase 14): renders every component's
 * procedurally-generated mesh in a dedicated three.js scene (separate from the
 * Part Studio Viewport, like RobotPreview). Components are colored by type.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useStore } from "../store";

const TYPE_COLOR: Record<string, number> = {
  wall: 0xcfc9bd,
  slab: 0x9aa0a6,
  column: 0x8a6d3b,
  beam: 0x6b7a8f,
  door: 0x6ab04a,
  window: 0x4a90d9,
};

export function BIMPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameRef = useRef(0);
  const groupsRef = useRef<Map<string, THREE.Mesh>>(new Map());

  const doc = useStore((s) => s.doc);
  const activeBimId = useStore((s) => s.activeBimId);
  const bimMeshes = useStore((s) => s.bimMeshes);
  const computeBimMeshes = useStore((s) => s.computeBimMeshes);

  const bim = doc.bims.find((b) => b.id === activeBimId) ?? null;
  const componentTypeById = new Map(bim?.components.map((c) => [c.id, c.type]) ?? []);

  // Set up the scene once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    const { clientWidth: w, clientHeight: h } = container;
    const camera = new THREE.PerspectiveCamera(45, w / h || 1, 1, 200000);
    camera.position.set(8000, 6000, 8000);
    camera.up.set(0, 0, 1); // Z-up
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(1, 1, 2);
    scene.add(key);
    const grid = new THREE.GridHelper(20000, 20, 0x444444, 0x2a2a2a);
    grid.rotateX(Math.PI / 2);
    scene.add(grid);
    scene.add(new THREE.AxesHelper(2000));

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

  // Compute meshes when the active BIM tab changes.
  useEffect(() => {
    void computeBimMeshes();
  }, [activeBimId, computeBimMeshes]);

  // Rebuild mesh objects when bimMeshes changes.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    // Remove stale.
    for (const [id, mesh] of groupsRef.current) {
      if (!bimMeshes[id]) {
        scene.remove(mesh);
        groupsRef.current.delete(id);
      }
    }
    // Add / refresh.
    for (const [id, shape] of Object.entries(bimMeshes)) {
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(shape.mesh.positions, 3));
      geom.setAttribute("normal", new THREE.BufferAttribute(shape.mesh.normals, 3));
      geom.setIndex(new THREE.BufferAttribute(shape.mesh.indices, 1));
      const type = componentTypeById.get(id) ?? "wall";
      const existing = groupsRef.current.get(id);
      if (existing) {
        existing.geometry.dispose();
        existing.geometry = geom;
      } else {
        const mat = new THREE.MeshStandardMaterial({
          color: TYPE_COLOR[type] ?? 0xbbbbbb,
          metalness: 0.05,
          roughness: 0.85,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geom, mat);
        groupsRef.current.set(id, mesh);
        scene.add(mesh);
      }
    }
  }, [bimMeshes, componentTypeById]);

  return <div ref={containerRef} className="h-full w-full" />;
}
