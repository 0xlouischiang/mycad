/**
 * Variables panel for the active Part Studio.
 *
 * Lists named variables with editable name + expression, shows each resolved
 * value (or an error if the expression is invalid), and offers add/delete.
 * Variables can reference earlier variables; feature dimensions can reference
 * them via expressions (see ParameterEditor's fx inputs).
 */
import { useState } from "react";
import { useStore } from "../store";
import { resolveVariableScope } from "../model/document";
import { tryEvalExpr } from "../model/expr";

export function VariablesPanel() {
  const doc = useStore((s) => s.doc);
  const addVariable = useStore((s) => s.addVariable);
  const updateVariable = useStore((s) => s.updateVariable);
  const deleteVariable = useStore((s) => s.deleteVariable);

  const studio = doc.tabs.find((t) => t.id === doc.activeTabId) ?? doc.tabs[0];
  const variables = studio.variables;
  const scope = resolveVariableScope(variables);

  const [newName, setNewName] = useState("");
  const [newExpr, setNewExpr] = useState("");

  const addRow = () => {
    if (!newName.trim()) return;
    addVariable(newName, newExpr || "0");
    setNewName("");
    setNewExpr("");
  };

  return (
    <section className="border-t border-neutral-800 p-3">
      <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
        Variables
      </h2>

      <div className="flex flex-col gap-1">
        {variables.map((v) => {
          // Resolve this variable against the scope built from the ones before
          // it (so it can't see itself); simplest correct view is the full
          // scope value if present.
          const value = v.name in scope ? scope[v.name] : null;
          const valid = value !== null && Number.isFinite(value);
          return (
            <div key={v.id} className="flex items-center gap-1 text-xs">
              <input
                value={v.name}
                onChange={(e) => updateVariable(v.id, { name: e.target.value })}
                className="w-20 rounded border border-neutral-700 bg-neutral-800 px-1.5 py-1 text-neutral-100 outline-none focus:border-blue-500"
                aria-label="Variable name"
              />
              <span className="text-neutral-600">=</span>
              <input
                value={v.expression}
                onChange={(e) =>
                  updateVariable(v.id, { expression: e.target.value })
                }
                className={`min-w-0 flex-1 rounded border bg-neutral-800 px-1.5 py-1 font-mono text-neutral-100 outline-none focus:border-blue-500 ${
                  valid ? "border-neutral-700" : "border-red-700"
                }`}
                aria-label="Variable expression"
              />
              <span
                className={`w-14 shrink-0 text-right font-mono ${
                  valid ? "text-neutral-400" : "text-red-400"
                }`}
                title={valid ? "" : "Invalid expression"}
              >
                {valid ? formatNum(value) : "err"}
              </span>
              <button
                type="button"
                onClick={() => deleteVariable(v.id)}
                className="px-1 text-neutral-500 hover:text-red-400"
                aria-label="Delete variable"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Add row */}
      <div className="mt-2 flex items-center gap-1 text-xs">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="name"
          className="w-20 rounded border border-neutral-700 bg-neutral-900 px-1.5 py-1 text-neutral-100 outline-none focus:border-blue-500"
        />
        <span className="text-neutral-600">=</span>
        <input
          value={newExpr}
          onChange={(e) => setNewExpr(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addRow();
          }}
          placeholder="expression"
          className="min-w-0 flex-1 rounded border border-neutral-700 bg-neutral-900 px-1.5 py-1 font-mono text-neutral-100 outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={addRow}
          className="rounded bg-neutral-800 px-2 py-1 text-neutral-200 hover:bg-neutral-700"
        >
          +
        </button>
      </div>
      {newExpr.trim() !== "" && tryEvalExpr(newExpr, scope) === null && (
        <p className="mt-1 text-[10px] text-red-400">
          New expression doesn't evaluate yet.
        </p>
      )}
    </section>
  );
}

function formatNum(n: number): string {
  return Math.abs(n) >= 1e4 || (n !== 0 && Math.abs(n) < 1e-3)
    ? n.toExponential(2)
    : String(Math.round(n * 1000) / 1000);
}
