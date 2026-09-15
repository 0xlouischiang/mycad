/**
 * Configurations panel for the active Part Studio.
 *
 * A configuration is a named set of variable-value overrides (Onshape's
 * Configurations). Selecting one re-regenerates the model with those overrides
 * merged into the variable scope. Only variables can be overridden (features
 * drive off variables via expressions), so the override editor lists the
 * Part Studio's variables with an optional per-config value.
 */
import { useState } from "react";
import { useStore } from "../store";

export function ConfigurationsPanel() {
  const doc = useStore((s) => s.doc);
  const addConfiguration = useStore((s) => s.addConfiguration);
  const deleteConfiguration = useStore((s) => s.deleteConfiguration);
  const setActiveConfig = useStore((s) => s.setActiveConfig);
  const setConfigOverride = useStore((s) => s.setConfigOverride);

  const studio = doc.tabs.find((t) => t.id === doc.activeTabId) ?? doc.tabs[0];
  const { configurations, activeConfigId, variables } = studio;
  const active = configurations.find((c) => c.id === activeConfigId) ?? null;

  const [newName, setNewName] = useState("");

  return (
    <section className="border-t border-neutral-800 p-3">
      <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
        Configurations
      </h2>

      {/* Active selector: Base + each config */}
      <div className="mb-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setActiveConfig(null)}
          className={`rounded px-2 py-1 text-xs ${
            activeConfigId === null
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          }`}
        >
          Base
        </button>
        {configurations.map((c) => (
          <span key={c.id} className="flex items-center">
            <button
              type="button"
              onClick={() => setActiveConfig(c.id)}
              className={`rounded-l px-2 py-1 text-xs ${
                activeConfigId === c.id
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {c.name}
            </button>
            <button
              type="button"
              onClick={() => deleteConfiguration(c.id)}
              className="rounded-r bg-neutral-800 px-1 py-1 text-xs text-neutral-500 hover:bg-red-900 hover:text-red-300"
              aria-label={`Delete ${c.name}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {/* Add config */}
      <div className="mb-2 flex items-center gap-1 text-xs">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newName.trim()) {
              addConfiguration(newName);
              setNewName("");
            }
          }}
          placeholder="new configuration"
          className="min-w-0 flex-1 rounded border border-neutral-700 bg-neutral-900 px-1.5 py-1 text-neutral-100 outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => {
            if (newName.trim()) {
              addConfiguration(newName);
              setNewName("");
            }
          }}
          className="rounded bg-neutral-800 px-2 py-1 text-neutral-200 hover:bg-neutral-700"
        >
          +
        </button>
      </div>

      {/* Override editor for the active config */}
      {active && (
        <div className="flex flex-col gap-1">
          <div className="text-[11px] text-neutral-500">
            Overrides for “{active.name}” (blank = use variable's expression)
          </div>
          {variables.length === 0 && (
            <div className="text-[11px] text-neutral-600">
              No variables to override. Add variables first.
            </div>
          )}
          {variables.map((v) => {
            const has = v.name in active.overrides;
            return (
              <div key={v.id} className="flex items-center gap-2 text-xs">
                <span className="w-24 truncate text-neutral-400">{v.name}</span>
                <input
                  type="number"
                  step="any"
                  value={has ? active.overrides[v.name] : ""}
                  placeholder="—"
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      setConfigOverride(active.id, v.name, null);
                    } else {
                      const n = Number(raw);
                      if (Number.isFinite(n))
                        setConfigOverride(active.id, v.name, n);
                    }
                  }}
                  className="w-full rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-right text-neutral-100 outline-none focus:border-blue-500"
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
