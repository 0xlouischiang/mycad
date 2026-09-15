/**
 * Parameter editor for the selected feature.
 *
 * Shows the feature's boolean operation, position, and type-specific
 * dimensions. Editing any field mutates the tree and triggers a debounced
 * regeneration (handled in the store). Renders nothing when no feature is
 * selected.
 */
import { useState } from "react";
import { useStore } from "../store";
import { useSketchStore } from "../sketch/sketchStore";
import { resolveVariableScope } from "../model/document";
import { tryEvalExpr } from "../model/expr";
import {
  isModifierFeature,
  isTransformFeature,
  type BooleanOperation,
  type BoxFeature,
  type CylinderFeature,
  type ExtrudeFeature,
  type HoleFeature,
  type ImportFeature,
  type LinkedFeature,
  type LoftFeature,
  type ModifierFeature,
  type SweepFeature,
  type RevolveFeature,
  type SketchFeature,
  type SolidFeature,
  type SplitFeature,
  type TransformFeature,
} from "../model/featureTree";

export function ParameterEditor() {
  const selectedId = useStore((s) => s.selectedId);
  const feature = useStore((s) =>
    s.tree.features.find((f) => f.id === selectedId),
  );
  const status = useStore((s) => (selectedId ? s.statuses[selectedId] : undefined));

  if (!feature) return null;

  return (
    <section className="border-t border-neutral-800 bg-neutral-950/60 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {feature.name}
        </h2>
        {status?.state === "error" && (
          <span className="text-[10px] text-red-400" title={status.message}>
            regen failed
          </span>
        )}
      </div>

      {feature.type === "sketch" ? (
        <SketchFields feature={feature} />
      ) : isModifierFeature(feature) ? (
        <ModifierFields feature={feature} />
      ) : isTransformFeature(feature) ? (
        <TransformFields feature={feature} />
      ) : (
        <SolidFields feature={feature} />
      )}

      {/* For fillet/chamfer, "ok" status carries an edges-resolved message. */}
      {isModifierFeature(feature) && status?.state === "ok" && status.message && (
        <p className="mt-3 text-[11px] text-neutral-500">{status.message}</p>
      )}

      {status?.state === "error" && status.message && (
        <p className="mt-3 rounded border border-red-900 bg-red-950/40 p-2 text-[11px] text-red-300">
          {status.message}
        </p>
      )}
    </section>
  );
}

/** Sketch node: summary + an "Edit sketch" button to re-open it in 2D. */
function SketchFields({ feature }: { feature: SketchFeature }) {
  const editSketch = useSketchStore((s) => s.editExisting);
  const { points, entities, constraints } = feature.sketch;
  return (
    <div className="flex flex-col gap-2 text-xs text-neutral-400">
      <div>Plane: {feature.planeId}</div>
      <div>
        {entities.length} entities · {points.length} points · {constraints.length}{" "}
        constraints
      </div>
      <button
        type="button"
        onClick={() => editSketch(feature.id, feature.sketch)}
        className="mt-1 rounded bg-neutral-800 px-2 py-1.5 text-neutral-200 hover:bg-neutral-700"
      >
        Edit sketch
      </button>
    </div>
  );
}

/** Fillet/chamfer (edge-based) and shell/draft (face-based) parameters. */
function ModifierFields({ feature }: { feature: ModifierFeature }) {
  const updateParams = useStore((s) => s.updateParams);
  const updateFeature = useStore((s) => s.updateFeature);

  // Edge-referencing modifiers.
  if (feature.type === "fillet" || feature.type === "chamfer") {
    const isFillet = feature.type === "fillet";
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xs text-neutral-400">
          {feature.edgeRefs.length} edge(s) referenced
        </div>
        <FieldLabel>{isFillet ? "Fillet" : "Chamfer"}</FieldLabel>
        {isFillet ? (
          <NumberField
            label="radius"
            value={feature.params.radius}
            min={0.001}
            onChange={(v) => updateParams(feature.id, { radius: v })}
          />
        ) : (
          <NumberField
            label="distance"
            value={feature.params.distance}
            min={0.001}
            onChange={(v) => updateParams(feature.id, { distance: v })}
          />
        )}
      </div>
    );
  }

  // Hole: position + bore params + type-specific fields.
  if (feature.type === "hole") {
    return <HoleFields feature={feature} />;
  }

  // Split: plane + offset + which side to keep.
  if (feature.type === "split") {
    return <SplitFields feature={feature} />;
  }

  // Face-referencing modifiers (shell/draft).
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-neutral-400">
        {feature.faceRefs.length} face(s) referenced
      </div>
      {feature.type === "shell" ? (
        <>
          <FieldLabel>Shell</FieldLabel>
          <NumberField
            label="thickness"
            value={feature.params.thickness}
            min={0.001}
            onChange={(v) => updateParams(feature.id, { thickness: v })}
          />
        </>
      ) : (
        <>
          <FieldLabel>Draft</FieldLabel>
          <div className="flex items-center gap-2">
            <span className="w-14 text-sm text-neutral-400">pull</span>
            <SegmentedChoice
              options={["x", "y", "z"]}
              value={feature.params.direction}
              onChange={(v) =>
                updateFeature(feature.id, {
                  params: { ...feature.params, direction: v },
                } as Partial<ModifierFeature>)
              }
            />
          </div>
          <NumberField
            label="angle°"
            value={feature.params.angle}
            min={0.001}
            onChange={(v) => updateParams(feature.id, { angle: v })}
          />
        </>
      )}
    </div>
  );
}

/** Hole: plane + position + bore params + type-specific recess fields. */
function HoleFields({ feature }: { feature: HoleFeature }) {
  const updateParams = useStore((s) => s.updateParams);
  const updateFeature = useStore((s) => s.updateFeature);
  const p = feature.params;
  const setP = (patch: Record<string, string | number>) =>
    updateFeature(feature.id, {
      params: { ...p, ...patch },
    } as Partial<HoleFeature>);

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Hole</FieldLabel>
      <div className="flex items-center gap-2">
        <span className="w-14 text-sm text-neutral-400">plane</span>
        <SegmentedChoice
          options={["XY", "XZ", "YZ"]}
          value={p.plane}
          onChange={(v) => setP({ plane: v })}
        />
      </div>
      <NumberField label="x" value={p.x} onChange={(v) => updateParams(feature.id, { x: v })} />
      <NumberField label="y" value={p.y} onChange={(v) => updateParams(feature.id, { y: v })} />
      <NumberField
        label="offset"
        value={p.startOffset}
        onChange={(v) => updateParams(feature.id, { startOffset: v })}
      />
      <NumberField
        label="⌀ dia"
        value={p.diameter}
        min={0.001}
        onChange={(v) => updateParams(feature.id, { diameter: v })}
        bind={{ featureId: feature.id, param: "diameter" }}
      />
      <NumberField
        label="depth"
        value={p.depth}
        min={0.001}
        onChange={(v) => updateParams(feature.id, { depth: v })}
        bind={{ featureId: feature.id, param: "depth" }}
      />
      <div className="flex items-center gap-2">
        <span className="w-14 text-sm text-neutral-400">type</span>
        <SegmentedChoice
          options={["simple", "counterbore", "countersink"]}
          value={p.holeType}
          onChange={(v) => setP({ holeType: v })}
        />
      </div>
      {p.holeType === "counterbore" && (
        <>
          <NumberField
            label="cb ⌀"
            value={p.cboreDiameter}
            min={0.001}
            onChange={(v) => updateParams(feature.id, { cboreDiameter: v })}
          />
          <NumberField
            label="cb depth"
            value={p.cboreDepth}
            min={0.001}
            onChange={(v) => updateParams(feature.id, { cboreDepth: v })}
          />
        </>
      )}
      {p.holeType === "countersink" && (
        <>
          <NumberField
            label="cs ⌀"
            value={p.csinkDiameter}
            min={0.001}
            onChange={(v) => updateParams(feature.id, { csinkDiameter: v })}
          />
          <NumberField
            label="cs °"
            value={p.csinkAngle}
            min={1}
            onChange={(v) => updateParams(feature.id, { csinkAngle: v })}
          />
        </>
      )}
    </div>
  );
}

/** Split: cut plane + offset + which side to keep. */
function SplitFields({ feature }: { feature: SplitFeature }) {
  const updateParams = useStore((s) => s.updateParams);
  const updateFeature = useStore((s) => s.updateFeature);
  const p = feature.params;
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Split</FieldLabel>
      <div className="flex items-center gap-2">
        <span className="w-14 text-sm text-neutral-400">plane</span>
        <SegmentedChoice
          options={["XY", "XZ", "YZ"]}
          value={p.plane}
          onChange={(v) =>
            updateFeature(feature.id, {
              params: { ...p, plane: v },
            } as Partial<SplitFeature>)
          }
        />
      </div>
      <NumberField
        label="offset"
        value={p.offset}
        onChange={(v) => updateParams(feature.id, { offset: v })}
      />
      <div className="flex items-center gap-2">
        <span className="w-14 text-sm text-neutral-400">keep</span>
        <SegmentedChoice
          options={["positive", "negative"]}
          value={p.keep}
          onChange={(v) =>
            updateFeature(feature.id, {
              params: { ...p, keep: v },
            } as Partial<SplitFeature>)
          }
        />
      </div>
    </div>
  );
}

/** Mirror / linear pattern / circular pattern parameters. */
function TransformFields({ feature }: { feature: TransformFeature }) {
  const updateParams = useStore((s) => s.updateParams);
  const updateFeature = useStore((s) => s.updateFeature);

  // Patch a string-valued param (axis/plane) via updateFeature since
  // updateParams only carries numbers/booleans.
  const setParam = (patch: Record<string, string | number | boolean>) =>
    updateFeature(feature.id, {
      params: { ...feature.params, ...patch },
    } as Partial<TransformFeature>);

  if (feature.type === "mirror") {
    return (
      <div className="flex flex-col gap-2">
        <FieldLabel>Mirror plane</FieldLabel>
        <SegmentedChoice
          options={["XY", "XZ", "YZ"]}
          value={feature.params.plane}
          onChange={(v) => setParam({ plane: v })}
        />
        <label className="flex items-center justify-between gap-2 text-sm">
          <span className="w-24 text-neutral-400">keep original</span>
          <input
            type="checkbox"
            checked={feature.params.keepOriginal}
            onChange={(e) => updateParams(feature.id, { keepOriginal: e.target.checked })}
            className="h-4 w-4 accent-blue-600"
          />
        </label>
      </div>
    );
  }

  if (feature.type === "linearPattern") {
    return (
      <div className="flex flex-col gap-2">
        <FieldLabel>Linear pattern</FieldLabel>
        <SegmentedChoice
          options={["x", "y", "z"]}
          value={feature.params.axis}
          onChange={(v) => setParam({ axis: v })}
        />
        <NumberField
          label="count"
          value={feature.params.count}
          min={2}
          onChange={(v) => updateParams(feature.id, { count: Math.round(v) })}
        />
        <NumberField
          label="spacing"
          value={feature.params.spacing}
          onChange={(v) => updateParams(feature.id, { spacing: v })}
        />
      </div>
    );
  }

  // circularPattern
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Circular pattern</FieldLabel>
      <SegmentedChoice
        options={["x", "y", "z"]}
        value={feature.params.axis}
        onChange={(v) => setParam({ axis: v })}
      />
      <NumberField
        label="count"
        value={feature.params.count}
        min={2}
        onChange={(v) => updateParams(feature.id, { count: Math.round(v) })}
      />
      <NumberField
        label="angle°"
        value={feature.params.angle}
        onChange={(v) => updateParams(feature.id, { angle: v })}
      />
    </div>
  );
}

/** A small segmented button group for enum-like string params. */
function SegmentedChoice({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded border border-neutral-700">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`flex-1 px-2 py-1 text-xs uppercase transition ${
            value === o
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/** Solid features: operation + type-specific fields. */
function SolidFields({ feature }: { feature: SolidFeature }) {
  return (
    <>
      <OperationRow feature={feature} />
      <div className="my-3 h-px bg-neutral-800" />
      {feature.type === "extrude" ? (
        <ExtrudeFields feature={feature} />
      ) : feature.type === "revolve" ? (
        <RevolveFields feature={feature} />
      ) : feature.type === "loft" ? (
        <LoftFields feature={feature} />
      ) : feature.type === "sweep" ? (
        <SweepFields feature={feature} />
      ) : feature.type === "linked" ? (
        <LinkedFields feature={feature} />
      ) : feature.type === "import" ? (
        <ImportFields feature={feature} />
      ) : (
        <>
          <DimensionFields feature={feature} />
          <div className="my-3 h-px bg-neutral-800" />
          <PositionFields feature={feature} />
        </>
      )}
    </>
  );
}

/** Linked reference: shows source + a manual "Update reference" action. */
function LinkedFields({ feature }: { feature: LinkedFeature }) {
  const updateReference = useStore((s) => s.updateReference);
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Linked reference</FieldLabel>
      <div className="text-xs text-neutral-400">from {feature.sourceLabel}</div>
      <div className="text-[11px] text-neutral-500">
        {feature.cachedTree.features.length} feature(s) cached · read-only, no
        live sync
      </div>
      <button
        type="button"
        onClick={() => updateReference(feature.id)}
        className="mt-1 rounded bg-neutral-800 px-2 py-1.5 text-neutral-200 hover:bg-neutral-700"
      >
        Update reference
      </button>
    </div>
  );
}

/** Loft: shows the ordered profile sketches and a ruled/smooth toggle. */
function LoftFields({ feature }: { feature: LoftFeature }) {
  const updateParams = useStore((s) => s.updateParams);
  const tree = useStore((s) => s.tree);
  const nameOf = (id: string) =>
    tree.features.find((f) => f.id === id)?.name ?? "(missing)";
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Loft profiles</FieldLabel>
      <ol className="list-decimal pl-5 text-xs text-neutral-400">
        {feature.sketchIds.map((id) => (
          <li key={id}>{nameOf(id)}</li>
        ))}
      </ol>
      <label className="flex items-center justify-between gap-2 text-sm">
        <span className="text-neutral-400">ruled (straight)</span>
        <input
          type="checkbox"
          checked={feature.params.ruled}
          onChange={(e) => updateParams(feature.id, { ruled: e.target.checked })}
          className="h-4 w-4 accent-blue-600"
        />
      </label>
    </div>
  );
}

/** Sweep: shows the profile + path sketches (no numeric params). */
function SweepFields({ feature }: { feature: SweepFeature }) {
  const tree = useStore((s) => s.tree);
  const nameOf = (id: string) =>
    tree.features.find((f) => f.id === id)?.name ?? "(missing)";
  return (
    <div className="flex flex-col gap-1 text-xs text-neutral-400">
      <FieldLabel>Sweep</FieldLabel>
      <div>profile: {nameOf(feature.profileSketchId)}</div>
      <div>path: {nameOf(feature.pathSketchId)}</div>
    </div>
  );
}

/** Imported STEP/STL geometry: shows source file + size (read-only). */
function ImportFields({ feature }: { feature: ImportFeature }) {
  return (
    <div className="flex flex-col gap-1 text-xs text-neutral-400">
      <FieldLabel>Imported</FieldLabel>
      <div className="truncate">{feature.fileName}</div>
      <div className="text-[11px] text-neutral-500">
        {feature.format.toUpperCase()} · {Math.round(feature.data.length / 1024)} KB
      </div>
    </div>
  );
}

function ExtrudeFields({ feature }: { feature: ExtrudeFeature }) {
  const updateParams = useStore((s) => s.updateParams);
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Extrude</FieldLabel>
      <NumberField
        label="distance"
        value={feature.params.distance}
        min={0.001}
        onChange={(v) => updateParams(feature.id, { distance: v })}
        bind={{ featureId: feature.id, param: "distance" }}
      />
      <label className="flex items-center justify-between gap-2 text-sm">
        <span className="w-20 text-neutral-400">flip</span>
        <input
          type="checkbox"
          checked={feature.params.flip}
          disabled={feature.params.symmetric ?? false}
          onChange={(e) => updateParams(feature.id, { flip: e.target.checked })}
          className="h-4 w-4 accent-blue-600 disabled:opacity-40"
        />
      </label>
      <label className="flex items-center justify-between gap-2 text-sm">
        <span className="w-20 text-neutral-400">symmetric</span>
        <input
          type="checkbox"
          checked={feature.params.symmetric ?? false}
          onChange={(e) => updateParams(feature.id, { symmetric: e.target.checked })}
          className="h-4 w-4 accent-blue-600"
        />
      </label>
    </div>
  );
}

function RevolveFields({ feature }: { feature: RevolveFeature }) {
  const updateParams = useStore((s) => s.updateParams);
  const updateFeature = useStore((s) => s.updateFeature);
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Revolve</FieldLabel>
      <div className="flex items-center gap-2">
        <span className="w-14 text-sm text-neutral-400">axis</span>
        <SegmentedChoice
          options={["u", "v"]}
          value={feature.params.axis}
          onChange={(v) =>
            updateFeature(feature.id, {
              params: { ...feature.params, axis: v },
            } as Partial<RevolveFeature>)
          }
        />
      </div>
      <NumberField
        label="angle°"
        value={feature.params.angle}
        min={0.001}
        onChange={(v) => updateParams(feature.id, { angle: v })}
      />
    </div>
  );
}

function OperationRow({ feature }: { feature: SolidFeature }) {
  const setOperation = useStore((s) => s.setOperation);
  const ops: BooleanOperation[] = ["new", "add", "remove"];
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-xs text-neutral-400">Operation</span>
      <div className="flex overflow-hidden rounded border border-neutral-700">
        {ops.map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => setOperation(feature.id, op)}
            className={`px-2 py-1 text-xs capitalize transition ${
              feature.operation === op
                ? "bg-blue-600 text-white"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {op}
          </button>
        ))}
      </div>
    </div>
  );
}

function DimensionFields({ feature }: { feature: BoxFeature | CylinderFeature }) {
  const updateParams = useStore((s) => s.updateParams);

  if (feature.type === "box") {
    const box = feature as BoxFeature;
    return (
      <div className="flex flex-col gap-2">
        <FieldLabel>Dimensions</FieldLabel>
        {(["dx", "dy", "dz"] as const).map((k) => (
          <NumberField
            key={k}
            label={k}
            value={box.params[k]}
            min={0.001}
            onChange={(v) => updateParams(feature.id, { [k]: v })}
            bind={{ featureId: feature.id, param: k }}
          />
        ))}
      </div>
    );
  }

  const cyl = feature as CylinderFeature;
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Dimensions</FieldLabel>
      <NumberField
        label="radius"
        value={cyl.params.radius}
        min={0.001}
        onChange={(v) => updateParams(feature.id, { radius: v })}
        bind={{ featureId: feature.id, param: "radius" }}
      />
      <NumberField
        label="height"
        value={cyl.params.height}
        min={0.001}
        onChange={(v) => updateParams(feature.id, { height: v })}
        bind={{ featureId: feature.id, param: "height" }}
      />
    </div>
  );
}

function PositionFields({ feature }: { feature: BoxFeature | CylinderFeature }) {
  const updateFeature = useStore((s) => s.updateFeature);
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Position</FieldLabel>
      {(["x", "y", "z"] as const).map((axis) => (
        <NumberField
          key={axis}
          label={axis}
          value={feature.position[axis]}
          onChange={(v) =>
            updateFeature(feature.id, {
              position: { ...feature.position, [axis]: v },
            })
          }
        />
      ))}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
      {children}
    </span>
  );
}

/**
 * A numeric parameter field. When `bind` is supplied, the field gains an "fx"
 * toggle: fx-on shows an expression input (bound to the feature's `exprs` map
 * via setParamExpr) evaluated against the Part Studio variable scope; fx-off is
 * a plain number input. A param that already has an expression opens in fx mode.
 */
function NumberField({
  label,
  value,
  min,
  onChange,
  bind,
}: {
  label: string;
  value: number;
  min?: number;
  onChange: (v: number) => void;
  bind?: { featureId: string; param: string };
}) {
  const setParamExpr = useStore((s) => s.setParamExpr);
  const feature = useStore((s) =>
    bind ? s.tree.features.find((f) => f.id === bind.featureId) : undefined,
  );
  const doc = useStore((s) => s.doc);
  const existingExpr = bind && feature?.exprs ? feature.exprs[bind.param] : undefined;
  const [fx, setFx] = useState<boolean>(existingExpr != null);

  const scope = resolveVariableScope(
    (doc.tabs.find((t) => t.id === doc.activeTabId) ?? doc.tabs[0]).variables,
  );
  const preview = existingExpr != null ? tryEvalExpr(existingExpr, scope) : null;
  const exprValid = existingExpr == null || preview !== null;

  return (
    <label className="flex items-center justify-between gap-2 text-sm">
      <span className="flex w-14 items-center gap-1 text-neutral-400">
        {bind && (
          <button
            type="button"
            onClick={() => {
              const next = !fx;
              setFx(next);
              // Turning fx off clears the stored expression (revert to literal).
              if (!next && bind) setParamExpr(bind.featureId, bind.param, "");
            }}
            title={fx ? "Use a number" : "Use an expression"}
            className={`rounded px-1 text-[10px] ${
              fx ? "bg-blue-600 text-white" : "bg-neutral-700 text-neutral-300"
            }`}
          >
            fx
          </button>
        )}
        <span className="truncate">{label}</span>
      </span>
      {bind && fx ? (
        <span className="flex w-full items-center gap-1">
          <input
            type="text"
            defaultValue={existingExpr ?? String(value)}
            onChange={(e) => setParamExpr(bind.featureId, bind.param, e.target.value)}
            placeholder="expr"
            className={`w-full rounded border bg-neutral-800 px-2 py-1 text-right font-mono text-neutral-100 outline-none focus:border-blue-500 ${
              exprValid ? "border-neutral-700" : "border-red-700"
            }`}
          />
          <span className="w-10 shrink-0 text-right text-[10px] text-neutral-500">
            {preview !== null ? Math.round(preview * 100) / 100 : "err"}
          </span>
        </span>
      ) : (
        <input
          type="number"
          step="any"
          min={min}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v)) onChange(v);
          }}
          className="w-full rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-right text-neutral-100 outline-none focus:border-blue-500"
        />
      )}
    </label>
  );
}
