/**
 * 3D preview for a CFD tab: reuses Viewport (one body + overlays), not a
 * dedicated three.js scene. Face picking tags boundaries; a Box3Helper shows
 * the domain; a scalar overlay paints p / |U| after a solve.
 */
import { useEffect, useRef, useState } from "react";
import { Viewport } from "../viewport/Viewport";
import { useStore } from "../store";
import { autoDomainBox, type DomainBox, type PatchType } from "../model/cfd";
import { PATCH_COLORS } from "./colormap";
import type { FaceRef } from "../model/edgeRef";

export function CFDPreview({ overlayField }: { overlayField: "p" | "magU" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<Viewport | null>(null);
  const downPos = useRef<{ x: number; y: number } | null>(null);

  const cfdShape = useStore((s) => s.cfdShape);
  const selectedFaceRefs = useStore((s) => s.selectedFaceRefs);
  const setSelectedFaces = useStore((s) => s.setSelectedFaces);
  const doc = useStore((s) => s.doc);
  const activeCfdId = useStore((s) => s.activeCfdId);
  const cfd = doc.cfds.find((c) => c.id === activeCfdId) ?? null;

  const [legend, setLegend] = useState<{ min: number; max: number; name: string } | null>(
    null,
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const vp = new Viewport(containerRef.current);
    vp.setPickMode("face");
    vp.onFaceSelectionChange = (refs) => setSelectedFaces(refs);
    viewportRef.current = vp;
    return () => {
      vp.dispose();
      viewportRef.current = null;
    };
  }, [setSelectedFaces]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    if (cfdShape) vp.setShape(cfdShape);
    else vp.clearShape();
  }, [cfdShape]);

  useEffect(() => {
    viewportRef.current?.setFaceSelection(selectedFaceRefs);
  }, [selectedFaceRefs]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || !cfd) return;
    const map = new Map<FaceRef, [number, number, number]>();
    for (const p of cfd.boundaryPatches) {
      const c = PATCH_COLORS[p.type as PatchType] ?? PATCH_COLORS.wall;
      map.set(p.faceRef, c);
    }
    vp.setFaceColorMap(map);
  }, [cfd, cfd?.boundaryPatches]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || !cfdShape) return;
    const bbox = cfdShape.bbox;
    const domain: DomainBox = cfd?.domainBox
      ? cfd.domainBox
      : cfd
        ? autoDomainBox(bbox, cfd.domainMargins, cfd.flowType, cfd.flowDirection)
        : bbox;
    vp.setDomainBox(domain.min, domain.max);
  }, [cfd, cfd?.domainBox, cfd?.domainMargins, cfd?.flowType, cfd?.flowDirection, cfdShape]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const values = overlayField === "p" ? cfd?.results?.p : cfd?.results?.magU;
    if (values && values.length > 0) {
      const arr = Float32Array.from(values);
      let lo = Infinity;
      let hi = -Infinity;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] < lo) lo = arr[i];
        if (arr[i] > hi) hi = arr[i];
      }
      vp.setFieldOverlay(arr, { min: lo, max: hi });
      setLegend({ min: lo, max: hi, name: overlayField === "p" ? "p" : "|U|" });
    } else {
      vp.setFieldOverlay(null);
      setLegend(null);
    }
  }, [cfd?.results, overlayField]);

  const toNdc = (e: React.PointerEvent): [number, number] => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    return [x, y];
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      onPointerMove={(e) => {
        const vp = viewportRef.current;
        if (!vp) return;
        const [x, y] = toNdc(e);
        const ref = vp.hover(x, y);
        if (containerRef.current) {
          containerRef.current.style.cursor = ref ? "pointer" : "default";
        }
      }}
      onPointerDown={(e) => {
        downPos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const vp = viewportRef.current;
        const start = downPos.current;
        downPos.current = null;
        if (!vp || !start) return;
        if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 4) return;
        const [x, y] = toNdc(e);
        vp.clickSelect(x, y, e.shiftKey);
      }}
    >
      {legend && (
        <div className="pointer-events-none absolute right-3 top-3 rounded bg-neutral-950/80 px-2 py-1 text-[10px] text-neutral-200">
          <div className="mb-1 text-neutral-400">{legend.name}</div>
          <div className="flex items-center gap-1">
            <span>{legend.min.toPrecision(3)}</span>
            <div
              className="h-2 w-24 rounded"
              style={{
                background:
                  "linear-gradient(to right, rgb(48,18,59), rgb(70,193,146), rgb(232,229,57))",
              }}
            />
            <span>{legend.max.toPrecision(3)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
