/**
 * Feature tree panel: the ordered list of features with per-row controls
 * (select, reorder, suppress, delete) and an "add feature" toolbar.
 *
 * The list order IS the evaluation order, top to bottom.
 */
import { useState } from "react";
import { useStore } from "../store";
import { InsertReferenceDialog } from "./InsertReferenceDialog";
import {
  isModifierFeature,
  isSolidFeature,
  isTransformFeature,
  type BooleanOperation,
  type Feature,
  type FeatureType,
} from "../model/featureTree";

const TYPE_LABELS: Record<FeatureType, string> = {
  box: "Box",
  cylinder: "Cylinder",
  sketch: "Sketch",
  extrude: "Extrude",
  fillet: "Fillet",
  chamfer: "Chamfer",
  mirror: "Mirror",
  linearPattern: "Linear Pattern",
  circularPattern: "Circular Pattern",
  linked: "Reference",
  revolve: "Revolve",
};

const OP_BADGE: Record<BooleanOperation, { text: string; cls: string }> = {
  new: { text: "new", cls: "bg-neutral-700 text-neutral-200" },
  add: { text: "+", cls: "bg-green-800 text-green-200" },
  remove: { text: "−", cls: "bg-red-900 text-red-200" },
};

/** Badges for non-boolean nodes. */
const SKETCH_BADGE = { text: "✎", cls: "bg-indigo-900 text-indigo-200" };
const MODIFIER_BADGE = { text: "◗", cls: "bg-amber-800 text-amber-100" };
const TRANSFORM_BADGE = { text: "⧉", cls: "bg-purple-900 text-purple-200" };

function badgeFor(f: Feature): { text: string; cls: string } {
  if (isTransformFeature(f)) return TRANSFORM_BADGE;
  if (isSolidFeature(f)) return OP_BADGE[f.operation];
  if (isModifierFeature(f)) return MODIFIER_BADGE;
  return SKETCH_BADGE;
}

export function FeatureTreePanel() {
  const features = useStore((s) => s.tree.features);
  const selectedId = useStore((s) => s.selectedId);
  const statuses = useStore((s) => s.statuses);
  const addFeature = useStore((s) => s.addFeature);
  const selectFeature = useStore((s) => s.selectFeature);
  const toggleSuppress = useStore((s) => s.toggleSuppress);
  const deleteFeature = useStore((s) => s.deleteFeature);
  const moveFeature = useStore((s) => s.moveFeature);
  const addExtrude = useStore((s) => s.addExtrude);
  const addRevolve = useStore((s) => s.addRevolve);
  const addFillet = useStore((s) => s.addFillet);
  const addChamfer = useStore((s) => s.addChamfer);
  const addMirror = useStore((s) => s.addMirror);
  const addLinearPattern = useStore((s) => s.addLinearPattern);
  const addCircularPattern = useStore((s) => s.addCircularPattern);
  const edgeCount = useStore((s) => s.selectedEdgeRefs.length);
  const [showInsertRef, setShowInsertRef] = useState(false);
  // Transforms need an existing body (any solid feature in the tree).
  const hasBody = features.some(
    (f) => f.type !== "sketch" && !f.suppressed,
  );

  // The selected feature, if it's a sketch, can be extruded.
  const selectedSketch = features.find(
    (f) => f.id === selectedId && f.type === "sketch",
  );
  const hasEdges = edgeCount > 0;

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-1 border-b border-neutral-800 px-3 py-2">
        <span className="mr-auto text-xs font-medium uppercase tracking-wide text-neutral-500">
          Features
        </span>
        <button
          type="button"
          onClick={() => addFeature("box")}
          className="rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700"
        >
          + Box
        </button>
        <button
          type="button"
          onClick={() => addFeature("cylinder")}
          className="rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700"
        >
          + Cylinder
        </button>
        <button
          type="button"
          disabled={!selectedSketch}
          onClick={() => selectedSketch && addExtrude(selectedSketch.id)}
          title={
            selectedSketch
              ? "Extrude the selected sketch"
              : "Select a sketch to extrude"
          }
          className="rounded bg-blue-700 px-2 py-1 text-xs text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
        >
          ↑ Extrude
        </button>
        <button
          type="button"
          disabled={!selectedSketch}
          onClick={() => selectedSketch && addRevolve(selectedSketch.id)}
          title={
            selectedSketch
              ? "Revolve the selected sketch"
              : "Select a sketch to revolve"
          }
          className="rounded bg-blue-700 px-2 py-1 text-xs text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
        >
          ↻ Revolve
        </button>
        <button
          type="button"
          disabled={!hasEdges}
          onClick={() => addFillet()}
          title={
            hasEdges
              ? `Fillet ${edgeCount} selected edge(s)`
              : "Select edges in the 3D view to fillet"
          }
          className="rounded bg-amber-700 px-2 py-1 text-xs text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
        >
          ◗ Fillet
        </button>
        <button
          type="button"
          disabled={!hasEdges}
          onClick={() => addChamfer()}
          title={
            hasEdges
              ? `Chamfer ${edgeCount} selected edge(s)`
              : "Select edges in the 3D view to chamfer"
          }
          className="rounded bg-amber-700 px-2 py-1 text-xs text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
        >
          ◗ Chamfer
        </button>
        <button
          type="button"
          disabled={!hasBody}
          onClick={() => addMirror()}
          title={hasBody ? "Mirror the body" : "Need a body first"}
          className="rounded bg-purple-800 px-2 py-1 text-xs text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
        >
          ⧉ Mirror
        </button>
        <button
          type="button"
          disabled={!hasBody}
          onClick={() => addLinearPattern()}
          title={hasBody ? "Linear pattern the body" : "Need a body first"}
          className="rounded bg-purple-800 px-2 py-1 text-xs text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
        >
          ⧉ Linear
        </button>
        <button
          type="button"
          disabled={!hasBody}
          onClick={() => addCircularPattern()}
          title={hasBody ? "Circular pattern the body" : "Need a body first"}
          className="rounded bg-purple-800 px-2 py-1 text-xs text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600"
        >
          ⧉ Circular
        </button>
        <button
          type="button"
          onClick={() => setShowInsertRef(true)}
          title="Insert a read-only reference to another document's Part Studio"
          className="rounded bg-teal-800 px-2 py-1 text-xs text-white hover:bg-teal-700"
        >
          ⛓ Ref
        </button>
      </div>

      {showInsertRef && (
        <InsertReferenceDialog onClose={() => setShowInsertRef(false)} />
      )}

      <ul className="min-h-0 flex-1 overflow-y-auto">
        {features.length === 0 && (
          <li className="px-4 py-6 text-center text-xs text-neutral-600">
            No features yet. Add a box or cylinder to begin.
          </li>
        )}
        {features.map((f, i) => {
          const status = statuses[f.id];
          const isError = status?.state === "error";
          const selected = f.id === selectedId;
          const badge = badgeFor(f);
          return (
            <li
              key={f.id}
              onClick={() => selectFeature(f.id)}
              className={`group flex cursor-pointer items-center gap-2 border-b border-neutral-800/60 px-3 py-2 text-sm ${
                selected ? "bg-blue-950/40" : "hover:bg-neutral-800/50"
              }`}
            >
              <span
                className={`inline-flex h-4 w-5 items-center justify-center rounded text-[10px] font-bold ${badge.cls}`}
                title={isSolidFeature(f) ? `Operation: ${f.operation}` : "Sketch"}
              >
                {badge.text}
              </span>

              <span
                className={`mr-auto truncate ${
                  f.suppressed ? "text-neutral-600 line-through" : ""
                } ${isError ? "text-red-400" : ""}`}
                title={isError ? status?.message : TYPE_LABELS[f.type]}
              >
                {f.name}
                {isError && " ⚠"}
              </span>

              {/* Row controls — visible on hover/selection */}
              <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                <IconBtn
                  label="Move up"
                  disabled={i === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveFeature(f.id, -1);
                  }}
                >
                  ↑
                </IconBtn>
                <IconBtn
                  label="Move down"
                  disabled={i === features.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveFeature(f.id, 1);
                  }}
                >
                  ↓
                </IconBtn>
                <IconBtn
                  label={f.suppressed ? "Unsuppress" : "Suppress"}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSuppress(f.id);
                  }}
                >
                  {f.suppressed ? "◌" : "●"}
                </IconBtn>
                <IconBtn
                  label="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFeature(f.id);
                  }}
                >
                  ✕
                </IconBtn>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function IconBtn({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-5 w-5 items-center justify-center rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 disabled:opacity-20"
    >
      {children}
    </button>
  );
}
