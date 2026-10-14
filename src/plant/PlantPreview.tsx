/**
 * 3D preview of a plant tab. One mesh per line, equipment, and support, colored
 * by kind. Open ports are drawn as spheres; an unconnected port is red.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useStore } from "../store";

const COLOR: Record<string, number> = {
  line: 0xd97706,
  equipment: 0x38bdf8,
  support: 0xa3e635,
};

export function PlantPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameRef = useRef(0);
  const groupsRef = useRef<Map<string, THREE.Object3D>>(new Map());

  const doc = useStore((s) => s.doc);
  const activePlantId = useStore((s) => s.activePlantId);
  const plantMeshes = useStore((s) => s.plantMeshes);
  const computePlantMeshes = useStore((s) => s.computePlantMeshes);
  const plant = doc.plants.find((p) => p.id === activePlantId) ?? null;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    const { clientWidth: w, clientHeight: h } = container;
    const camera = new THREE.PerspectiveCamera(45, w / h || 1, 1, 200000);
    camera.position.set(6000, 5000, 6000);
    camera.up.set(0, 0, 1);
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

  useEffect(() => {
    void computePlantMeshes();
  }, [activePlantId, computePlantMeshes]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    for (const [id, obj] of groupsRef.current) {
      if (!plantMeshes[id] && !id.startsWith("ports:")) {
        scene.remove(obj);
        groupsRef.current.delete(id);
      }
    }
    for (const [id, shape] of Object.entries(plantMeshes)) {
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(shape.mesh.positions, 3));
      geom.setAttribute("normal", new THREE.BufferAttribute(shape.mesh.normals, 3));
      geom.setIndex(new THREE.BufferAttribute(shape.mesh.indices, 1));
      const kind = plant?.lines.some((l) => l.id === id)
        ? "line"
        : plant?.equipment.some((e) => e.id === id)
          ? "equipment"
          : "support";
      const existing = groupsRef.current.get(id);
      if (existing instanceof THREE.Mesh) {
        existing.geometry.dispose();
        existing.geometry = geom;
      } else {
        const mat = new THREE.MeshStandardMaterial({
          color: COLOR[kind],
          metalness: 0.2,
          roughness: 0.6,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geom, mat);
        groupsRef.current.set(id, mesh);
        scene.add(mesh);
      }
    }

    // Ports: one group per line, rebuilt whenever the meshes are.
    if (plant) {
      for (const line of plant.lines) {
        const key = `ports:${line.id}`;
        const previous = groupsRef.current.get(key);
        if (previous) scene.remove(previous);
        const group = new THREE.Group();
        for (const seg of line.runs) {
          for (const port of seg.ports) {
            const sphere = new THREE.Mesh(
              new THREE.SphereGeometry(port.nps * 0.25, 10, 8),
              new THREE.MeshStandardMaterial({ color: port.connectedTo ? 0x22c55e : 0xef4444 }),
            );
            sphere.position.set(port.position.x, port.position.y, port.position.z);
            group.add(sphere);
          }
        }
        groupsRef.current.set(key, group);
        scene.add(group);
      }
    }
  }, [plantMeshes, plant]);

  return <div ref={containerRef} className="h-full w-full" />;
}
