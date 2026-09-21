/**
 * three.js viewport: owns the scene, camera, renderer, and orbit controls.
 *
 * It is deliberately framework-agnostic (no React inside) so the render loop
 * and GPU resources live outside React's lifecycle. A thin React component
 * (Viewport.tsx) mounts/unmounts it.
 *
 * Phase 1 responsibility: display a single shape mesh built from kernel output,
 * with an edge overlay. `setShape` replaces the current shape's geometry
 * *incrementally* — we update the existing BufferGeometry attributes rather
 * than rebuilding the whole scene, per architecture requirement #4.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { ShapeResult } from "../kernel/protocol";
import {
  edgeRefFromPoints,
  faceRefFromPoints,
  type EdgeRef,
  type FaceRef,
} from "../model/edgeRef";

/** What the pointer picks in the 3D view. */
export type PickMode = "edge" | "face";

/** Named standard camera orientations. */
export type StandardView =
  | "front"
  | "back"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "iso";

/** Edge colors as [r,g,b] floats for vertex-color highlighting. */
const EDGE_BASE: [number, number, number] = [0.04, 0.04, 0.04];
const EDGE_HOVER: [number, number, number] = [1.0, 0.6, 0.1];
const EDGE_SELECTED: [number, number, number] = [0.98, 0.8, 0.09];

/** Face colors: the base blue tint, plus hover/selected highlights. */
const FACE_BASE: [number, number, number] = [0.29, 0.56, 0.85];
const FACE_HOVER: [number, number, number] = [0.45, 0.7, 0.95];
const FACE_SELECTED: [number, number, number] = [0.96, 0.75, 0.2];

export class Viewport {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private resizeObserver: ResizeObserver;
  private frame = 0;

  /** Last shape bbox, so standard views can frame even between regens. */
  private lastBbox: ShapeResult["bbox"] = {
    min: [-20, -20, -20],
    max: [20, 20, 20],
  };

  /** Section-view clipping plane, applied to the mesh material when active. */
  private sectionPlane: THREE.Plane | null = null;

  // Reusable objects for the current shape. Created once, updated in place.
  private meshGeometry: THREE.BufferGeometry;
  private mesh: THREE.Mesh;
  private edgeGeometry: THREE.BufferGeometry;
  private edgeLines: THREE.LineSegments;
  /** Frame the camera only on the first shape, so live edits don't yank it. */
  private hasFramed = false;

  // --- Edge picking state ---
  private raycaster = new THREE.Raycaster();
  /** Per-line-segment edge ref, indexed by segment number (2 verts each). */
  private segmentRefs: EdgeRef[] = [];
  /** Distinct edge refs currently rendered. */
  private edgeRefs: Set<EdgeRef> = new Set();
  /** Vertex-color buffer for the edge lines (2 verts * 3 channels per seg). */
  private edgeColors: Float32Array = new Float32Array(0);
  private hoveredRef: EdgeRef | null = null;
  private selectedRefs: Set<EdgeRef> = new Set();
  /** Callback invoked when the edge selection set changes via interaction. */
  onSelectionChange: ((refs: EdgeRef[]) => void) | null = null;

  // --- Face picking state ---
  /** Current pick mode: edges (fillet/chamfer) or faces (shell/draft). */
  private pickMode: PickMode = "edge";
  /** Per-mesh-triangle face ref, indexed by triangle number. */
  private triFaceRefs: FaceRef[] = [];
  /** Distinct face refs currently rendered. */
  private faceRefs: Set<FaceRef> = new Set();
  /** Per-triangle-vertex base color buffer for face highlighting. */
  private faceColors: Float32Array = new Float32Array(0);
  private hoveredFace: FaceRef | null = null;
  private selectedFaces: Set<FaceRef> = new Set();
  /** Callback invoked when the face selection set changes via interaction. */
  onFaceSelectionChange: ((refs: FaceRef[]) => void) | null = null;

  /** Optional wireframe of the CFD far-field / internal domain box. */
  private domainHelper: THREE.Box3Helper | null = null;
  /** Per-vertex scalar overlay (pressure / |U|); null restores role/base colors. */
  private fieldOverlay: Float32Array | null = null;
  private fieldMin = 0;
  private fieldMax = 1;
  /** Optional per-face role colors (CFD patch tagging). */
  private faceColorMap: Map<FaceRef, [number, number, number]> | null = null;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);

    const { clientWidth: w, clientHeight: h } = container;
    this.camera = new THREE.PerspectiveCamera(45, w / h || 1, 0.1, 10000);
    this.camera.position.set(80, 60, 80);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.localClippingEnabled = true; // for section-view clipping
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Lighting: a key directional light + fill + ambient so faces read clearly.
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(1, 1.5, 1);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.7);
    fill.position.set(-1, -0.5, -1);
    this.scene.add(fill);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Ground grid for spatial reference.
    const grid = new THREE.GridHelper(400, 40, 0x444444, 0x2a2a2a);
    this.scene.add(grid);
    this.scene.add(new THREE.AxesHelper(30));

    // Preallocate the shape's mesh + edge objects.
    this.meshGeometry = new THREE.BufferGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff, // base tint comes from per-vertex colors
      vertexColors: true,
      metalness: 0.1,
      roughness: 0.6,
      side: THREE.DoubleSide,
      flatShading: false,
    });
    this.mesh = new THREE.Mesh(this.meshGeometry, material);
    this.mesh.visible = false;
    this.scene.add(this.mesh);

    this.edgeGeometry = new THREE.BufferGeometry();
    // vertexColors lets us tint individual edges for hover/selection without
    // separate geometry per edge.
    const edgeMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
    this.edgeLines = new THREE.LineSegments(this.edgeGeometry, edgeMaterial);
    this.edgeLines.visible = false;
    this.scene.add(this.edgeLines);

    // Raycaster line threshold controls how close the cursor must be (world
    // units) to hit an edge; tuned in updatePickThreshold() from camera dist.
    this.raycaster.params.Line = { threshold: 0.5 };

    this.resizeObserver = new ResizeObserver(() => this.onResize(container));
    this.resizeObserver.observe(container);

    this.animate();
  }

  /**
   * Replace the displayed shape with a new kernel result. Updates buffer
   * attributes in place instead of allocating new geometry objects.
   */
  setShape(result: ShapeResult): void {
    const { mesh, edges } = result;

    this.meshGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(mesh.positions, 3),
    );
    this.meshGeometry.setAttribute(
      "normal",
      new THREE.BufferAttribute(mesh.normals, 3),
    );
    this.meshGeometry.setIndex(new THREE.BufferAttribute(mesh.indices, 1));

    // Build the per-triangle face-ref map + per-vertex color buffer for face
    // picking/highlighting. faceGroups are [indexStart, indexCount, faceHash]
    // triples in INDEX units (see occt-wasm-group-units). Each group's face ref
    // is the bbox center of its triangles' vertices (matches the worker's
    // getBoundingBox-center at shell/draft resolve time).
    this.faceColors = new Float32Array(mesh.positions.length);
    this.triFaceRefs = new Array(mesh.triangleCount);
    this.faceRefs = new Set();
    const fg = mesh.faceGroups;
    for (let g = 0; g < fg.length; g += 3) {
      const indexStart = fg[g];
      const indexCount = fg[g + 1];
      // Collect this face's vertex positions to compute its bbox-center ref.
      const coords: number[] = [];
      for (let i = indexStart; i < indexStart + indexCount; i++) {
        const v = mesh.indices[i] * 3;
        coords.push(mesh.positions[v], mesh.positions[v + 1], mesh.positions[v + 2]);
      }
      const ref = faceRefFromPoints(coords);
      this.faceRefs.add(ref);
      // Record ref per triangle (indexCount/3 triangles, starting at
      // indexStart/3).
      const triStart = indexStart / 3;
      for (let t = 0; t < indexCount / 3; t++) this.triFaceRefs[triStart + t] = ref;
    }
    this.meshGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(this.faceColors, 3),
    );
    this.meshGeometry.attributes.position.needsUpdate = true;
    this.meshGeometry.computeBoundingSphere();
    this.mesh.visible = true;

    // Drop face selections no longer present after regeneration.
    for (const ref of [...this.selectedFaces]) {
      if (!this.faceRefs.has(ref)) this.selectedFaces.delete(ref);
    }
    if (this.hoveredFace && !this.faceRefs.has(this.hoveredFace)) {
      this.hoveredFace = null;
    }
    this.repaintFaces();

    // Edge overlay + picking metadata. `points` are XYZ samples, `edgeGroups`
    // are [floatStart, floatCount, hash] triples (float offsets — see
    // occt-wasm-group-units). We expand each polyline into LineSegments pairs
    // AND record, per segment, the stable geometric EdgeRef of its parent edge
    // so raycast hits map back to a persistent reference.
    const built = buildEdgeSegments(edges.points, edges.edgeGroups);
    this.segmentRefs = built.segmentRefs;
    this.edgeRefs = new Set(built.segmentRefs);
    this.edgeColors = new Float32Array(built.positions.length);
    this.edgeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(built.positions, 3),
    );
    this.edgeGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(this.edgeColors, 3),
    );
    this.edgeGeometry.attributes.position.needsUpdate = true;
    this.edgeGeometry.computeBoundingSphere();
    this.edgeLines.visible = true;

    // Drop selections/hover for edges no longer present after regeneration.
    for (const ref of [...this.selectedRefs]) {
      if (!this.edgeRefs.has(ref)) this.selectedRefs.delete(ref);
    }
    if (this.hoveredRef && !this.edgeRefs.has(this.hoveredRef)) {
      this.hoveredRef = null;
    }
    this.repaintEdges();

    if (!this.hasFramed) {
      this.frameShape(result.bbox);
      this.hasFramed = true;
    }
  }

  /** Recompute every edge vertex color from hover/selection state. */
  private repaintEdges(): void {
    const colors = this.edgeColors;
    for (let seg = 0; seg < this.segmentRefs.length; seg++) {
      const ref = this.segmentRefs[seg];
      const c = this.selectedRefs.has(ref)
        ? EDGE_SELECTED
        : ref === this.hoveredRef
          ? EDGE_HOVER
          : EDGE_BASE;
      // Two vertices per segment, 3 channels each.
      const base = seg * 6;
      colors[base] = c[0];
      colors[base + 1] = c[1];
      colors[base + 2] = c[2];
      colors[base + 3] = c[0];
      colors[base + 4] = c[1];
      colors[base + 5] = c[2];
    }
    const attr = this.edgeGeometry.getAttribute("color");
    if (attr) attr.needsUpdate = true;
  }

  /** Recompute every mesh-triangle vertex color from face hover/selection. */
  private repaintFaces(): void {
    const colors = this.faceColors;
    const indices = this.meshGeometry.getIndex();
    if (!indices) return;
    const pos = this.meshGeometry.getAttribute("position");
    if (this.fieldOverlay && pos) {
      const n = pos.count;
      const span = Math.max(this.fieldMax - this.fieldMin, 1e-12);
      for (let i = 0; i < n; i++) {
        const t = (this.fieldOverlay[i] - this.fieldMin) / span;
        const c = turboColor(t);
        colors[i * 3] = c[0];
        colors[i * 3 + 1] = c[1];
        colors[i * 3 + 2] = c[2];
      }
      // Hover/select still overlay on top of the field.
      for (let tri = 0; tri < this.triFaceRefs.length; tri++) {
        const ref = this.triFaceRefs[tri];
        if (!this.selectedFaces.has(ref) && ref !== this.hoveredFace) continue;
        const c = this.selectedFaces.has(ref) ? FACE_SELECTED : FACE_HOVER;
        for (let k = 0; k < 3; k++) {
          const vi = indices.getX(tri * 3 + k) * 3;
          colors[vi] = c[0];
          colors[vi + 1] = c[1];
          colors[vi + 2] = c[2];
        }
      }
    } else {
      for (let tri = 0; tri < this.triFaceRefs.length; tri++) {
        const ref = this.triFaceRefs[tri];
        const role = this.faceColorMap?.get(ref);
        const c = this.selectedFaces.has(ref)
          ? FACE_SELECTED
          : ref === this.hoveredFace
            ? FACE_HOVER
            : (role ?? FACE_BASE);
        for (let k = 0; k < 3; k++) {
          const vi = indices.getX(tri * 3 + k) * 3;
          colors[vi] = c[0];
          colors[vi + 1] = c[1];
          colors[vi + 2] = c[2];
        }
      }
    }
    const attr = this.meshGeometry.getAttribute("color");
    if (attr) attr.needsUpdate = true;
  }

  /** Explicitly refit the camera to the current shape (e.g. a "zoom to fit"). */
  frameCurrent(bbox: ShapeResult["bbox"]): void {
    this.frameShape(bbox);
  }

  /** Hide the current shape (e.g. when the tree is empty or all suppressed). */
  clearShape(): void {
    this.mesh.visible = false;
    this.edgeLines.visible = false;
    this.clearDomainBox();
    this.fieldOverlay = null;
    this.faceColorMap = null;
  }

  /** Draw (or replace) a translucent domain box in model millimetres. */
  setDomainBox(
    min: [number, number, number],
    max: [number, number, number],
  ): void {
    this.clearDomainBox();
    const box = new THREE.Box3(
      new THREE.Vector3(...min),
      new THREE.Vector3(...max),
    );
    this.domainHelper = new THREE.Box3Helper(box, new THREE.Color(0x22d3ee));
    this.scene.add(this.domainHelper);
  }

  clearDomainBox(): void {
    if (this.domainHelper) {
      this.scene.remove(this.domainHelper);
      this.domainHelper.geometry.dispose();
      (this.domainHelper.material as THREE.Material).dispose();
      this.domainHelper = null;
    }
  }

  /** Per-face role colors (e.g. inlet=green). Cleared by setScalarField. */
  setFaceColorMap(map: Map<FaceRef, [number, number, number]> | null): void {
    this.faceColorMap = map;
    if (!this.fieldOverlay) this.repaintFaces();
  }

  /**
   * Color vertices by a per-vertex scalar (length = vertexCount) through a turbo
   * colormap. Pass null to restore role/base colors.
   */
  setFieldOverlay(
    values: Float32Array | null,
    range?: { min: number; max: number },
  ): void {
    this.fieldOverlay = values;
    if (values && values.length > 0) {
      if (range) {
        this.fieldMin = range.min;
        this.fieldMax = range.max;
      } else {
        let lo = Infinity;
        let hi = -Infinity;
        for (let i = 0; i < values.length; i++) {
          const v = values[i];
          if (v < lo) lo = v;
          if (v > hi) hi = v;
        }
        this.fieldMin = lo;
        this.fieldMax = hi;
      }
    }
    this.repaintFaces();
  }

  /** Point the camera at the shape's bounding box and fit it in view. */
  private frameShape(
    bbox: ShapeResult["bbox"],
    viewDir?: THREE.Vector3,
    up?: THREE.Vector3,
  ): void {
    this.lastBbox = bbox;
    const min = new THREE.Vector3(...bbox.min);
    const max = new THREE.Vector3(...bbox.max);
    const center = min.clone().add(max).multiplyScalar(0.5);
    const size = max.clone().sub(min);
    const radius = Math.max(size.x, size.y, size.z, 1) * 0.5;

    const dist = radius / Math.sin((this.camera.fov * Math.PI) / 360);
    const dir = (viewDir ?? new THREE.Vector3(1, 0.8, 1)).clone().normalize();
    this.camera.position.copy(center.clone().add(dir.multiplyScalar(dist * 1.4)));
    if (up) this.camera.up.copy(up);
    this.camera.near = dist * 0.01;
    this.camera.far = dist * 100;
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(center);
    this.controls.update();
  }

  /**
   * Orient the camera to a named standard view, framed to the current shape.
   * Directions are the vector FROM the model TO the camera in world space.
   */
  setView(name: StandardView): void {
    const Z = new THREE.Vector3(0, 0, 1);
    const Y = new THREE.Vector3(0, 1, 0);
    const views: Record<
      StandardView,
      { dir: THREE.Vector3; up: THREE.Vector3 }
    > = {
      front: { dir: new THREE.Vector3(0, -1, 0), up: Z },
      back: { dir: new THREE.Vector3(0, 1, 0), up: Z },
      top: { dir: new THREE.Vector3(0, 0, 1), up: Y },
      bottom: { dir: new THREE.Vector3(0, 0, -1), up: Y },
      right: { dir: new THREE.Vector3(1, 0, 0), up: Z },
      left: { dir: new THREE.Vector3(-1, 0, 0), up: Z },
      iso: { dir: new THREE.Vector3(1, -1, 0.8), up: Z },
    };
    const v = views[name];
    this.frameShape(this.lastBbox, v.dir, v.up);
  }

  /**
   * Set (or clear) the section-view clipping plane. `axis` picks the plane
   * normal (world X/Y/Z); `offset` slides it along that axis. Passing null
   * clears the section. Geometry on the negative side of the plane is hidden,
   * revealing the interior.
   */
  setSection(axis: "x" | "y" | "z" | null, offset = 0): void {
    const mat = this.mesh.material as THREE.Material;
    if (axis === null) {
      this.sectionPlane = null;
      mat.clippingPlanes = [];
      mat.needsUpdate = true;
      return;
    }
    const normal =
      axis === "x"
        ? new THREE.Vector3(-1, 0, 0)
        : axis === "y"
          ? new THREE.Vector3(0, -1, 0)
          : new THREE.Vector3(0, 0, -1);
    // Plane keeps the half-space where normal·point + constant >= 0. With a
    // -axis normal, that's the side below `offset` along the axis.
    this.sectionPlane = new THREE.Plane(normal, offset);
    mat.clippingPlanes = [this.sectionPlane];
    mat.needsUpdate = true;
  }

  private onResize(container: HTMLElement): void {
    const { clientWidth: w, clientHeight: h } = container;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private animate = (): void => {
    this.frame = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  // -------------------------------------------------------------------------
  // Edge picking
  // -------------------------------------------------------------------------

  /**
   * Raycast from normalized device coords (x,y in [-1,1]) against the edge
   * lines and return the hit edge's stable ref, or null. Threshold scales with
   * camera distance so picking feels consistent at any zoom.
   */
  private pickEdge(ndcX: number, ndcY: number): EdgeRef | null {
    if (!this.edgeLines.visible) return null;
    // Scale the line pick threshold to ~0.8% of the camera-target distance.
    const dist = this.camera.position.distanceTo(this.controls.target);
    this.raycaster.params.Line = { threshold: Math.max(dist * 0.008, 0.05) };
    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    const hits = this.raycaster.intersectObject(this.edgeLines, false);
    if (hits.length === 0) return null;
    // intersectObject on LineSegments returns `index` = the vertex index; the
    // segment number is floor(index / 2).
    const idx = hits[0].index ?? 0;
    const seg = Math.floor(idx / 2);
    return this.segmentRefs[seg] ?? null;
  }

  /** Switch what the pointer picks (edges for fillet/chamfer, faces for shell/draft). */
  setPickMode(mode: PickMode): void {
    if (mode === this.pickMode) return;
    this.pickMode = mode;
    // Clear the transient hover of the mode we're leaving.
    this.hoveredRef = null;
    this.hoveredFace = null;
    this.repaintEdges();
    this.repaintFaces();
  }

  /** Raycast the solid mesh and return the hit triangle's face ref, or null. */
  private pickFace(ndcX: number, ndcY: number): FaceRef | null {
    if (!this.mesh.visible) return null;
    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    const hits = this.raycaster.intersectObject(this.mesh, false);
    if (hits.length === 0) return null;
    const faceIndex = hits[0].faceIndex; // triangle number
    if (faceIndex == null) return null;
    return this.triFaceRefs[faceIndex] ?? null;
  }

  /** Update hover highlight from NDC coords. Returns the hovered ref (mode-dependent). */
  hover(ndcX: number, ndcY: number): EdgeRef | FaceRef | null {
    if (this.pickMode === "face") {
      const ref = this.pickFace(ndcX, ndcY);
      if (ref !== this.hoveredFace) {
        this.hoveredFace = ref;
        this.repaintFaces();
      }
      return ref;
    }
    const ref = this.pickEdge(ndcX, ndcY);
    if (ref !== this.hoveredRef) {
      this.hoveredRef = ref;
      this.repaintEdges();
    }
    return ref;
  }

  /**
   * Handle a pick click. Toggles the hit edge/face (per mode) in its selection
   * set. Returns true if something was hit (so the caller can suppress orbit).
   */
  clickSelect(ndcX: number, ndcY: number, additive: boolean): boolean {
    if (this.pickMode === "face") {
      const ref = this.pickFace(ndcX, ndcY);
      if (!ref) {
        if (!additive && this.selectedFaces.size > 0) {
          this.selectedFaces.clear();
          this.repaintFaces();
          this.onFaceSelectionChange?.([]);
        }
        return false;
      }
      if (!additive) this.selectedFaces.clear();
      if (this.selectedFaces.has(ref)) this.selectedFaces.delete(ref);
      else this.selectedFaces.add(ref);
      this.repaintFaces();
      this.onFaceSelectionChange?.([...this.selectedFaces]);
      return true;
    }

    const ref = this.pickEdge(ndcX, ndcY);
    if (!ref) {
      if (!additive && this.selectedRefs.size > 0) {
        this.selectedRefs.clear();
        this.repaintEdges();
        this.emitSelection();
      }
      return false;
    }
    if (!additive) this.selectedRefs.clear();
    if (this.selectedRefs.has(ref)) this.selectedRefs.delete(ref);
    else this.selectedRefs.add(ref);
    this.repaintEdges();
    this.emitSelection();
    return true;
  }

  /** Replace the edge selection set programmatically (store-driven sync). */
  setSelection(refs: EdgeRef[]): void {
    this.selectedRefs = new Set(refs.filter((r) => this.edgeRefs.has(r)));
    this.repaintEdges();
  }

  /** Replace the face selection set programmatically (store-driven sync). */
  setFaceSelection(refs: FaceRef[]): void {
    this.selectedFaces = new Set(refs.filter((r) => this.faceRefs.has(r)));
    this.repaintFaces();
  }

  private emitSelection(): void {
    this.onSelectionChange?.([...this.selectedRefs]);
  }

  dispose(): void {
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.clearDomainBox();
    this.meshGeometry.dispose();
    this.edgeGeometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    (this.edgeLines.material as THREE.Material).dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

/**
 * Expand OCCT edge polylines into LineSegments-compatible endpoint pairs, and
 * emit a parallel array giving each segment's stable geometric EdgeRef.
 *
 * Each edge group is [floatStart, floatCount, edgeHash]. IMPORTANT: `floatStart`
 * and `floatCount` are measured in FLOATS (not points) into the `points` array
 * — verified empirically against occt-wasm 4.4 (a straight box edge reports
 * count=6 = two XYZ points). So a polyline has `floatCount / 3` points and we
 * emit `points - 1` line segments from it.
 *
 * The EdgeRef is computed from the whole edge's sample points (bbox center),
 * matching the worker's getBoundingBox-center used at fillet-resolve time. We
 * do NOT use the group's hash — hashes aren't stable across rebuilds.
 */
function buildEdgeSegments(
  points: Float32Array,
  edgeGroups: Int32Array,
): { positions: Float32Array; segmentRefs: EdgeRef[] } {
  const segments: number[] = [];
  const segmentRefs: EdgeRef[] = [];
  for (let g = 0; g < edgeGroups.length; g += 3) {
    const floatStart = edgeGroups[g];
    const floatCount = edgeGroups[g + 1];
    const pointCount = Math.floor(floatCount / 3);
    // One stable ref per whole edge, shared by all its segments.
    const ref = edgeRefFromPoints(points.subarray(floatStart, floatStart + floatCount));
    for (let i = 0; i < pointCount - 1; i++) {
      const a = floatStart + i * 3;
      const b = floatStart + (i + 1) * 3;
      segments.push(
        points[a], points[a + 1], points[a + 2],
        points[b], points[b + 1], points[b + 2],
      );
      segmentRefs.push(ref);
    }
  }
  return { positions: new Float32Array(segments), segmentRefs };
}

/** Google turbo colormap, t in [0,1] → RGB 0..1. */
function turboColor(t: number): [number, number, number] {
  const x = Math.min(1, Math.max(0, t));
  const r =
    0.13572138 +
    4.6153926 * x -
    42.66032258 * x ** 2 +
    132.13108234 * x ** 3 -
    152.94239396 * x ** 4 +
    59.28637943 * x ** 5;
  const g =
    0.09140261 +
    2.19454389 * x +
    4.84296658 * x ** 2 -
    14.18503333 * x ** 3 +
    4.27729857 * x ** 4 +
    2.82956604 * x ** 5;
  const b =
    0.1066733 +
    12.64194608 * x -
    60.58204836 * x ** 2 +
    110.36276771 * x ** 3 -
    89.90310912 * x ** 4 +
    27.34824973 * x ** 5;
  return [
    Math.min(1, Math.max(0, r)),
    Math.min(1, Math.max(0, g)),
    Math.min(1, Math.max(0, b)),
  ];
}
