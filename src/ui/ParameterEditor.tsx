/**
 * Parameter editor for the selected feature.
 *
 * Shows the feature's boolean operation, position, and type-specific
 * dimensions. Editing any field mutates the tree and triggers a debounced
 * regeneration (handled in the store). Renders nothing when no feature is
 * selected.
 */
import { useStore } from "../store";
import { useSketchStore } from "../sketch/sketchStore";
import {
  isModifierFeature,
  isTransformFeature,
  type BooleanOperation,
  type BoxFeature,
  type CylinderFeature,
  type ExtrudeFeature,
  type LinkedFeature,
  type ModifierFeature,
  type RevolveFeature,
  type SketchFeature,
  type SolidFeature,
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

/** Fillet/chamfer: edge count + radius/distance. */
function ModifierFields({ feature }: { feature: ModifierFeature }) {
  const updateParams = useStore((s) => s.updateParams);
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
      ) : feature.type === "linked" ? (
        <LinkedFields feature={feature} />
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
      />
      <label className="flex items-center justify-between gap-2 text-sm">
        <span className="w-14 text-neutral-400">flip</span>
        <input
          type="checkbox"
          checked={feature.params.flip}
          onChange={(e) => updateParams(feature.id, { flip: e.target.checked })}
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
      />
      <NumberField
        label="height"
        value={cyl.params.height}
        min={0.001}
        onChange={(v) => updateParams(feature.id, { height: v })}
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

function NumberField({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm">
      <span className="w-14 text-neutral-400">{label}</span>
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
    </label>
  );
}
