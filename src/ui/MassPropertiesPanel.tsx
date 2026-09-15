/**
 * Mass-properties readout for the current model (Onshape's Measure panel).
 *
 * Computing mass props is a worker round-trip (regenerate → getVolume etc.), so
 * it's on-demand via a button rather than recomputed every edit. Values reflect
 * the rollback bar (the store honors it when computing).
 */
import { useStore } from "../store";

export function MassPropertiesPanel() {
  const massProps = useStore((s) => s.massProps);
  const compute = useStore((s) => s.computeMassProps);
  const busy = useStore((s) => s.busy);

  const fmt = (n: number) =>
    Math.abs(n) >= 1e5 ? n.toExponential(3) : (Math.round(n * 1000) / 1000).toString();

  return (
    <section className="border-t border-neutral-800 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
          Mass properties
        </h2>
        <button
          type="button"
          onClick={() => void compute()}
          disabled={busy}
          className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700 disabled:opacity-40"
        >
          Measure
        </button>
      </div>

      {massProps === null ? (
        <p className="text-[11px] text-neutral-600">
          Click Measure to compute volume, area, and center of mass.
        </p>
      ) : massProps.volume === null ? (
        <p className="text-[11px] text-neutral-600">No solid in the model.</p>
      ) : (
        <dl className="flex flex-col gap-1 font-mono text-[11px] text-neutral-300">
          <div className="flex justify-between">
            <dt className="text-neutral-500">volume</dt>
            <dd>{fmt(massProps.volume)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">surface area</dt>
            <dd>{fmt(massProps.surfaceArea!)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="shrink-0 text-neutral-500">center</dt>
            <dd className="truncate">
              {massProps.centerOfMass!.map((n) => fmt(n)).join(", ")}
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}
