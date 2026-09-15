# myCAD User Guide

myCAD is a single-user, browser-based parametric 3D CAD app modeled on Onshape. You build solids from a **feature tree** (the ordered recipe for your part), sketch in 2D and turn sketches into 3D, and organize work into a **document** with multiple **Part Studio** tabs. It runs entirely in your browser — geometry is computed by an OpenCascade (OCCT) kernel in a background worker, and your work auto-saves locally.

---

## 1. Getting started

```bash
npm install
npm run dev        # starts the Vite dev server (default http://localhost:5173)
```

Open the URL in a modern browser. The kernel loads once on startup (the status dot in the sidebar goes **Ready**), then your most recently edited document is restored automatically.

Other scripts:

- `npm run build` — production build (type-checks, then bundles).
- `npm test` — runs the solver, profile, regeneration, and robot test suites.

### The status dot

Top-left of the sidebar shows a colored dot:

- **Green — Ready:** kernel idle, ready for input.
- **Yellow — Working…:** a regeneration is in flight.
- **Grey — Offline:** kernel not yet loaded.

---

## 2. The interface

myCAD has three views. You switch between them by what you're doing.

| View | When it shows | Layout |
| --- | --- | --- |
| **3D (Part Studio)** | default | Document bar + tab bar on top; feature-tree sidebar on the left; 3D viewport on the right |
| **Sketch** | while a sketch is open | Sketch toolbar on top; 2D drawing canvas below |
| **Robot** | a robot tab is active | Link/joint editor sidebar; articulated 3D preview |

### Top bars (3D mode)

- **Document bar:** document name (click to rename), save indicator, Undo/Redo, **New**, **Open ▾**, **Import**, **Export STEP**, **Export STL**.
- **Tab bar:** one tab per Part Studio, plus any robot tabs. `+` adds a Part Studio; **+ Robot** adds a robot. Double-click a tab to rename; hover to reveal its delete `✕`.

---

## 3. Documents, tabs, and saving

A **document** holds one or more **Part Studio** tabs. Each Part Studio is an independent workspace with its own feature tree, variables, configurations, version history, and undo stack.

- **New** — start a fresh document.
- **Open ▾** — pick from documents saved in this browser (shows name + last-modified date).
- **Rename** — edit the name field in the document bar (or double-click a tab to rename that tab).
- **Saving is automatic.** Changes are debounced and written to the browser's IndexedDB; the indicator reads **saved** / **unsaved** / **…** (saving). There is no manual save button.

> Documents live in *this browser only*. To move a part between machines, use **Export STEP** (see §9).

---

## 4. Building with the feature tree

The left sidebar's **Features** list is the ordered recipe for your part. **List order = evaluation order, top to bottom.** Each edit triggers a rebuild from the tree.

### Adding features

The toolbar above the list adds features. Buttons enable/disable based on what's valid right now (hover a disabled button for the reason).

**Primitives (always available)**
- **+ Box** — a box (dx, dy, dz).
- **+ Cylinder** — a cylinder (radius, height).

**From a sketch (select a sketch first)**
- **↑ Extrude** — extrude the selected sketch.
- **↻ Revolve** — revolve the selected sketch about an in-plane axis.

**From multiple sketches**
- **∿ Loft** — blend through all sketches in tree order (needs 2+).
- **⟿ Sweep** — sweep a profile along a path. Convention: profile = last sketch, path = the sketch before it.

**Edge modifiers (select edges in the viewport first)**
- **◗ Fillet** — round the selected edges (radius).
- **◗ Chamfer** — bevel the selected edges (distance).

**Face modifiers (switch the viewport to Faces mode, select faces)**
- **◗ Shell** — hollow the body, removing the selected face(s) (thickness).
- **◗ Draft** — taper the selected face(s) about a pull direction (angle).

**Body operations (need an existing body)**
- **◗ Hole** — simple / counterbore / countersink hole, positioned on a plane.
- **◗ Split** — cut the body by a plane and keep one side.
- **⧉ Mirror** — mirror the body across XY/XZ/YZ (optionally keep the original).
- **⧉ Linear** — linear pattern along X/Y/Z (count, spacing).
- **⧉ Circular** — circular pattern about X/Y/Z (count, angle).

**References**
- **⛓ Ref** — insert a read-only reference to another document's Part Studio (see §8).

### Row badges

Each feature row carries a small badge:

- **new / + / −** — a solid feature's boolean operation (new body, add/union, remove/subtract).
- **✎** — a sketch.
- **◗** — a modifier (fillet, chamfer, shell, draft, hole, split).
- **⧉** — a transform (mirror, pattern).

### Row controls (hover a row)

- **↑ / ↓** — reorder the feature (changes when it's evaluated).
- **● / ◌** — suppress / unsuppress (temporarily disable without deleting; name shows struck-through).
- **✕** — delete.
- **Double-click the name** — rename.
- **Double-click the row** — roll back to just before that feature.
- **Select a feature** — opens its parameters in the editor below the list.

An errored feature turns red with a ⚠; the rest of the tree still rebuilds around it. Select it to see the error message in the parameter editor.

### Rollback

Rollback lets you "rewind" the tree to see or edit an earlier state. An orange **rollback bar** marks the cut line; features below it are dimmed and inactive. Double-click a row to move the bar there; click **↓ to end** on the bar to reactivate everything.

---

## 5. Editing parameters and expressions

Select a feature to edit it in the **parameter editor** below the tree. Fields depend on the feature type — dimensions, position, boolean operation, plane/axis choices, checkboxes (e.g. extrude *flip* / *symmetric*, mirror *keep original*), and so on. Edits rebuild live.

### Expressions (the `fx` toggle)

Key dimension fields (box dx/dy/dz, cylinder radius/height, extrude distance, hole diameter/depth) have an **`fx`** button:

- **fx off** — a plain number.
- **fx on** — a math expression evaluated against the Part Studio's **variables**, with a live preview of the result (or `err`). Turning `fx` off reverts to a literal.

This is how you drive geometry from variables, e.g. `width / 2` or `holeDia * 1.5`.

---

## 6. Sketching

Sketches are 2D profiles you turn into 3D. Start one from the **New sketch** section of the sidebar:

- Choose a base plane: **Top (XY)**, **Front (XZ)**, or **Right (YZ)**.
- Optionally set a **plane offset** to sketch on a datum plane parallel to the base (needed to loft parallel profiles or sketch above a body).
- Or, in the viewport's **Faces** mode, select one flat face and click **Sketch on face**.

This opens **Sketch mode** with its own toolbar.

### Drawing tools

| Tool | Key | How |
| --- | --- | --- |
| Select | `V` | select / drag points |
| Line | `L` | click to chain line segments |
| Rectangle | `R` | click two opposite corners |
| Circle | `C` | click center, then radius |
| Arc | `A` | click center, start, end |
| Polygon | `G` | click center, then a vertex (set *sides* in the toolbar) |
| Slot | `S` | click end A, end B, then width |
| Ellipse | `E` | click center, major axis, then minor |
| Spline | `P` | click points; click **Finish spline** to complete |

`Esc` returns to the Select tool.

Other toolbar actions: **Fillet…** (round a corner between two lines by radius), **Mirror** (select entities plus a mirror line as the *last* selection), **Delete** (remove selected entities).

### Constraints

The solver keeps your sketch consistent as you drag or dimension. Select entities, then click a constraint:

- **Geometric:** Coincident, Horizontal, Vertical, Parallel, Perpendicular, Equal, Concentric, Midpoint, Symmetric, Tangent.
- **Dimensional (prompt for a value):** Distance, Angle, Radius.

The status line (bottom-right of the toolbar) reads **solved** or **under/over-constrained** after each solve — hover it for the residual.

### Finishing a sketch

- **✓ Finish sketch** — commit it into the feature tree as a Sketch node (or update the sketch you're editing).
- **Cancel** — discard changes and leave sketch mode.

To edit an existing sketch later, select its node and click **Edit sketch** in the parameter editor.

---

## 7. Viewport navigation and selection

The 3D viewport uses standard orbit controls:

- **Left-drag** — orbit.
- **Right-drag** — pan.
- **Scroll wheel** — zoom.
- A click that barely moves is a *pick*; a click that drags is an *orbit* (so you won't select by accident).

Overlay controls:

- **Edges / Faces toggle (top-left):** what the pointer selects. Edges feed fillet/chamfer; faces feed shell/draft and *sketch on face*.
- **Section (top-left):** slice the view along **X / Y / Z** with an offset slider (**off** to disable) — useful for seeing inside a part. This is a view aid only; it doesn't modify geometry.
- **Fr / To / Ri / Iso (top-right):** snap to front / top / right / isometric view.
- **Zoom to fit (top-right):** frame the whole model.

Selection:

- Click to select an edge/face; **Shift-click** to add to the selection.
- **Esc** clears the selection (and exits a read-only version view if one is open).
- A selection badge shows the count; with exactly one face selected in Faces mode, a **Sketch on face** button appears.

### Measuring

Selection doubles as a quick measure (readout, bottom-right):

- **One edge selected** → its true length.
- **Two selections** (any mix of edges/faces) → center-to-center distance with a ΔX/ΔY/ΔZ breakdown.

The bottom-left readout always shows the model's overall **X × Y × Z** bounding-box size.

---

## 8. Variables, configurations, versions

These panels sit in the sidebar, each scoped to the **active Part Studio**.

### Variables

Named values with expressions. A variable can reference earlier variables. Each row shows name, expression, and the resolved value (or `err`). Feature dimensions reference variables through the `fx` expression fields (§5). Add with the name/expression row at the bottom.

### Configurations

A configuration is a named set of **variable overrides** — Onshape-style variants of the same part. Select **Base** (no overrides) or a configuration to rebuild the model with those values. Add a configuration, then fill in per-variable override values (blank = use the variable's own expression). Only variables can be overridden, so drive the geometry you want to vary through variables first.

### Versions

A per-Part-Studio linear history of snapshots:

- **+ Create version** — snapshot the current state.
- **Open** — view a past version read-only (a banner appears; **Exit** or `Esc` to leave).
- **Restore** — **non-destructive**: it *forks* a new current state from the chosen version. Nothing is ever deleted.

### Mass properties

The **Mass properties** panel reports volume, surface area, and center of mass for the current body.

---

## 9. Importing and exporting

From the document bar:

- **Import** — load a `.step` / `.stp` / `.stl` file as a body (added as an Import feature in the tree).
- **Export STEP** — precise B-rep solid; the right choice for moving parts to other CAD tools or re-importing later.
- **Export STL** — triangle mesh; the right choice for 3D printing.

---

## 10. Linked references

**⛓ Ref** inserts a read-only copy of another document's Part Studio into the current one, fused into your part. The reference stores a **cached snapshot** — there is **no live sync**. When the source changes, select the reference and click **Update reference** in the parameter editor to pull the latest.

---

## 11. Robot design (kinematic tree + URDF)

A **robot tab** (created with **+ Robot** on the tab bar) builds a kinematic tree — links connected by joints — for export to ROS. This is a narrow feature: a parent/child joint tree, **not** a general assembly-mate solver. Links reuse the bodies you've already modeled in Part Studio tabs (no geometry is duplicated).

The robot view has an editor sidebar and a live 3D preview:

**Links**
- Add a link from any Part Studio with its **+ &lt;tab name&gt;** button. The link references that tab's body.
- Each row shows the link name, its source tab, and whether it's the tree **root**; `✕` deletes it.

**Joints**
- Add a joint by choosing **parent → child** links and a **type**, then **+ joint**.
- Types: **revolute, continuous, prismatic, fixed, floating, planar** (the URDF joint set).
- For revolute / continuous / prismatic joints, a **slider** drives the joint value; the preview re-poses the linked bodies live via forward kinematics (no re-tessellation).

**Validation**
- A banner reports whether you have a valid single-rooted tree, or the specific problem (multiple roots, a cycle, an orphan, a link with two parents, a self-loop).

**Export**
- **Export URDF** — a well-formed URDF file plus one STL per link (mesh paths point at `meshes/<link>.stl`). The tree is validated before anything downloads.
- **Export xacro** — the same model, but repeated sub-trees (e.g. four identical wheels — same source body and matching joint type/axis/limits) are emitted once as a `<xacro:macro>` with per-instance calls, instead of a fully flattened file. With no repetition it falls back to flat URDF with the xacro namespace.

> ROS2 controller config, sensor metadata, and Gazebo/RViz launch files are intentionally out of scope until the exported URDF is verified against real ROS2 tooling.

---

## 12. Keyboard shortcuts

**3D mode**
- **Ctrl/Cmd + Z** — undo
- **Ctrl/Cmd + Shift + Z** or **Ctrl/Cmd + Y** — redo
- **Delete / Backspace** — delete the selected feature
- **Esc** — clear the 3D selection (or exit a read-only version view)

**Sketch mode**
- `V` select · `L` line · `R` rectangle · `C` circle · `A` arc · `G` polygon · `S` slot · `E` ellipse · `P` spline
- **Esc** — back to the Select tool

*(Shortcuts are ignored while you're typing in a text or number field.)*

---

## 13. Tips & troubleshooting

- **A feature turned red (⚠).** Its inputs became invalid — often an edge/face reference lost when upstream geometry changed a lot, or a self-intersecting sketch profile. Select it to read the message; adjust the upstream feature or re-pick the edges/faces.
- **A button is disabled.** Hover it — the tooltip says what's missing (e.g. "Select a sketch to extrude", "Need 2+ sketches to loft", "Select faces (Faces mode) to shell").
- **Can't select the face/edge you want.** Check the **Edges / Faces** toggle matches what the operation needs.
- **Sketch reads "under/over-constrained."** It still solved to *something*, but add or remove constraints for a fully-defined profile before relying on it.
- **My document vanished on another computer.** Documents are stored per-browser. Export STEP to carry a part across machines.
- **Extrude/loft/sweep won't run.** Extrude/revolve need a *closed* profile; loft needs 2+ sketches; sweep needs a profile sketch and a separate path sketch.
</content>
</invoke>
