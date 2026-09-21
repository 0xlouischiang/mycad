# myCAD User Guide

myCAD is a single-user, browser-based parametric CAD app modeled on Onshape. You build solids from a **feature tree** (the ordered recipe for your part), sketch in 2D and turn sketches into 3D, and organize work into a **document** with multiple tabs. Beyond mechanical parts it also does **robot design** (kinematic trees → URDF), **building modeling** (BIM → IFC), and **incompressible CFD** (part → OpenFOAM.org v11 case), and you can drive mechanical, building, and CFD setup with **plain-language chat**. Geometry is computed by an OpenCascade (OCCT) kernel in a background worker; your work auto-saves locally. OpenFOAM solves run in local Docker if it's available — otherwise you can still download a case zip and run it yourself.

---

## 1. Getting started

```bash
npm install
npm run dev        # starts the Vite dev server (default http://localhost:5173)
```

Open the URL in a modern browser. The kernel loads once on startup (the status dot in the sidebar goes **Ready**), then your most recently edited document is restored automatically.

Other scripts:

- `npm run build` — production build (type-checks, then bundles).
- `npm test` — runs the full suite (solver, sketch, regeneration, robot, BIM geometry/cascade/IFC, CFD case generation, and the chat command layers).

### Optional: enabling chat

Natural-language modeling (§12) calls the Claude API through a small server-side proxy so your API key never reaches the browser. Set it in the environment before `npm run dev`:

```bash
ANTHROPIC_API_KEY=sk-...   # required for chat
CLAUDE_MODEL=...           # optional model override
```

If the key isn't set, everything else works normally and the chat panel shows a short "set your key" note instead of erroring.

### Optional: local OpenFOAM (in-app CFD solve)

Case authoring and **Download case (.zip)** never need Docker. **Start run** in a CFD tab submits the case to a local OpenFOAM.org v11 container:

```bash
# default image; override if you have a different Foundation v11 build
OPENFOAM_IMAGE=openfoam/openfoam11-paraviewopenfoam
```

`docker info` must succeed (Docker Desktop running). If it isn't, Start run returns a clear error and the zip download still works. A solve is capped at 30 minutes.

### The status dot

Top-left of the sidebar shows a colored dot:

- **Green — Ready:** kernel idle, ready for input.
- **Yellow — Working…:** a regeneration is in flight.
- **Grey — Offline:** kernel not yet loaded.

---

## 2. The interface

myCAD has five views. Which one you see depends on the active tab and what you're doing.

| View | When it shows | Layout |
| --- | --- | --- |
| **3D (Part Studio)** | default | Document bar + tab bar on top; feature-tree sidebar on the left; 3D viewport on the right |
| **Sketch** | while a sketch is open | Sketch toolbar on top; 2D drawing canvas below |
| **Robot** | a robot tab is active | Link/joint editor sidebar; articulated 3D preview |
| **BIM** | a BIM tab is active | Level/grid/component sidebar; 2D plan view over a 3D massing preview |
| **CFD** | a CFD tab is active | Fluid/boundary/mesh sidebar; 3D preview of the source body with domain box + field overlay |

### Top bars

- **Document bar:** document name (click to rename), save indicator, Undo/Redo, **New**, **Open ▾**, **Import**, **Export STEP**, **Export STL**.
- **Tab bar:** one tab per Part Studio, then robot tabs, then BIM tabs, then CFD tabs. `+` adds a Part Studio, **+ Robot** adds a robot (⚙), **+ BIM** adds a building (🏛), **+ CFD** adds a flow case (🌊, cyan). Double-click any tab to rename; hover to reveal its delete `✕`. The four tab families are mutually exclusive — clicking one switches the whole view.

---

## 3. Documents, tabs, and saving

A **document** holds one or more **Part Studio** tabs plus any robot, BIM, and CFD tabs. Each Part Studio is an independent workspace with its own feature tree, variables, configurations, version history, and undo stack.

- **New** — start a fresh document.
- **Open ▾** — pick from documents saved in this browser (shows name + last-modified date).
- **Rename** — edit the name field in the document bar (or double-click a tab).
- **Saving is automatic.** Changes are debounced and written to the browser's IndexedDB; the indicator reads **saved** / **unsaved** / **…** (saving). There is no manual save button.

> Documents live in *this browser only*. To move a part between machines, use **Export STEP** (§9); for a building, use **Export IFC** (§11).

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
- **⛓ Ref** — insert a read-only reference to another document's Part Studio (see §10).

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

(Robots export URDF/xacro — §11; buildings export IFC — §11.)

---

## 10. Linked references

**⛓ Ref** inserts a read-only copy of another document's Part Studio into the current one, fused into your part. The reference stores a **cached snapshot** — there is **no live sync**. When the source changes, select the reference and click **Update reference** in the parameter editor to pull the latest.

---

## 11. Robot design, building (BIM), and CFD

myCAD has three additive modeling modes beyond mechanical parts. All are separate tab types and none of them touches the Part Studio workflow.

### Robot design (kinematic tree → URDF)

A **robot tab** (**+ Robot**, ⚙) builds a kinematic tree — links connected by joints — for export to ROS. This is a narrow feature: a parent/child joint tree, **not** a general assembly-mate solver. Links reuse bodies you've already modeled in Part Studio tabs (no geometry is duplicated).

**Links** — add one from any Part Studio with its **+ ⟨tab name⟩** button; it references that tab's body. Each row shows the link's source tab and whether it's the tree **root**; `✕` deletes it.

**Joints** — choose **parent → child** links and a **type**, then **+ joint**. Types are the URDF set: **revolute, continuous, prismatic, fixed, floating, planar**. For revolute / continuous / prismatic joints a **slider** drives the joint value and the preview re-poses the bodies live (forward kinematics; no re-tessellation).

**Validation** — a banner reports a valid single-rooted tree, or the specific problem (multiple roots, a cycle, an orphan, a link with two parents, a self-loop).

**Export**
- **Export URDF** — a well-formed URDF plus one STL per link (mesh paths `meshes/<link>.stl`). The tree is validated before anything downloads.
- **Export xacro** — same model, but repeated sub-trees (e.g. four identical wheels) become one `<xacro:macro>` with per-instance calls instead of a flattened file.

> ROS2 controller config, sensor metadata, and Gazebo/RViz launch files are intentionally out of scope until the exported URDF is verified against real ROS2 tooling.

### Building modeling (BIM → IFC)

A **BIM tab** (**+ BIM**, 🏛) authors a simple building: levels, grid lines, and building components. Units are millimeters, Z-up. The view has a sidebar (levels, grids, components), a top-down **plan view**, and a 3D **massing preview** below it.

**Levels & grids** — the sidebar lists storeys with editable elevation; **+ Level** adds one. **+ X** / **+ Y** add orthogonal grid lines you can offset; plan-view drawing snaps to them.

**Drawing components** — pick a tool in the plan view and click on the grid:

| Tool | How |
| --- | --- |
| Wall | click start, then end |
| Beam | click start, then end |
| Column | click a point |
| Slab | click boundary points, then **Finish slab** (or double-click) |
| Door / Window | click on a wall — it's hosted there and cuts a real opening |
| Space | click a point inside a room — its boundary is traced from the enclosing walls |

Massing (walls/slabs/columns/beams) is generated procedurally. A door or window performs a genuine boolean **cut** into its host wall. Editing or deleting a host wall **cascades**: openings reposition, and any that no longer fit are **flagged** (highlighted, with a warning) rather than left as stale geometry. A **Space** reports floor **area and volume** and re-traces automatically when its bounding walls change.

**Parameters** — the sidebar's component rows edit type-specific values (wall thickness/height/layers, slab thickness, column/beam sizes, door/window width/height/sill/position). Warnings show in amber.

**IFC round-trip** — **Export IFC** writes an IFC4 file (walls → IfcWall, slabs → IfcSlab, doors/windows as wall-hosted openings, spaces → IfcSpace, etc.); **Import IFC** loads one back as a new BIM tab. The component graph and hosting relationships survive the round trip.

### CFD (part → OpenFOAM case)

A **CFD tab** (**+ CFD**, 🌊) wraps a Part Studio body as an incompressible OpenFOAM.org v11 case. Geometry is not duplicated — pick the source Part Studio in the sidebar. v1 covers single-phase laminar or RANS (k-ε / k-ω SST), steady (`simpleFoam`) or transient (`pimpleFoam`), external (body in a far-field box) or internal (duct/pipe) flow.

**Units** — CAD lengths (domain box, mesh cell size) stay millimetres so they match the viewport. Fluid density is kg/m³, viscosity m²/s, inlet velocity m/s, outlet pressure Pa. The case generator converts millimetres to metres when writing dicts.

**Boundaries** — switch is unnecessary: the preview is always in Faces mode. Click faces, choose a type (inlet / outlet / wall / movingWall / symmetry / freestream), **Tag selected**. Untagged faces become `walls`. External flow also creates far-field inlet/outlet/symmetry patches on the domain box.

**Download case (.zip)** — writes a complete Foundation v11 tree (`system/`, `constant/`, `0/`, `Allrun`) you can run on any OpenFOAM 11 install. This works with Docker stopped.

**Start run** — submits the same tree to a local Docker container (`OPENFOAM_IMAGE`, default `openfoam/openfoam11-paraviewopenfoam`), polls the log, and on success paints pressure / |U| on the body and fills the results panel (Cd/Cl or Δp). Jobs keep running if you close the tab; reopen the CFD tab to resume. Hard 30-minute kill. If Docker isn't up, you get a clear error and can still download the zip.

v1 does **not** do multiphase, compressible flow, heat transfer, rotating machinery, or volume rendering.

---

## 12. Natural-language modeling (chat)

Part Studio, BIM, and CFD views have an **Assistant** panel in the sidebar. Type an instruction and myCAD turns it into the *same* commands the buttons use, so anything the assistant creates behaves exactly like a hand-made change — you can edit it in the sidebar afterwards, and each result appears as it lands.

- **In a Part Studio:** *"make a 40×30×20 box, then a 5mm fillet on its top edges."* It can add primitives, primitive sketches (rectangle/circle/polygon), extrude/revolve, fillet/chamfer/shell/draft, holes, mirror, patterns, and edit or delete features. It targets edges/faces by reasoning over the live geometry (e.g. "the top edges"), not by you clicking.
- **In a BIM tab:** *"add a 5m wall on the north side, then put a door in it."* It can create levels, grids, walls, slabs, columns, beams, doors/windows (hosted in a wall), and spaces.
- **In a CFD tab:** *"tag the upstream face as inlet at 1 m/s, the downstream as outlet, air, k-ε."* It tags faces by the same geometry catalog as fillet/shell, and can set fluid, turbulence, domain, mesh, and solver controls.

How it behaves:

- **Step by step** — multiple actions run in order and show up one at a time (✓ lines in the transcript).
- **Retries** — if a command fails (e.g. an opening that doesn't fit), the error goes back to the model and it corrects itself, up to a small limit before giving up with a plain-language message.
- **Clarify** — if your instruction is ambiguous or missing a dimension that matters, it asks a question instead of guessing; answer in the same box to continue.
- **Clear** resets the conversation. Chat isn't persisted across reloads.

The assistant only ever calls validated commands — it never edits geometry directly, so the kernel stays the single source of truth. If chat is disabled you'll see a note to set `ANTHROPIC_API_KEY` (§1).

---

## 13. Keyboard shortcuts

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

## 14. Tips & troubleshooting

- **A feature turned red (⚠).** Its inputs became invalid — often an edge/face reference lost when upstream geometry changed a lot, or a self-intersecting sketch profile. Select it to read the message; adjust the upstream feature or re-pick the edges/faces.
- **A button is disabled.** Hover it — the tooltip says what's missing (e.g. "Select a sketch to extrude", "Need 2+ sketches to loft", "Select faces (Faces mode) to shell").
- **Can't select the face/edge you want.** Check the **Edges / Faces** toggle matches what the operation needs.
- **Sketch reads "under/over-constrained."** It still solved to *something*, but add or remove constraints for a fully-defined profile before relying on it.
- **A door/window is flagged in the BIM view.** It no longer fits its host wall (the wall was shortened or the opening is too big/tall). Resize or reposition it, or shrink the opening.
- **A space shows a warning / no area.** Its seed point isn't enclosed by a connected loop of walls — close the room's walls, or move the seed inside.
- **Chat says it's disabled.** Set `ANTHROPIC_API_KEY` in the server environment and restart `npm run dev` (§1).
- **My document vanished on another computer.** Documents are stored per-browser. Export STEP (parts) or IFC (buildings) to carry work across machines.
- **Extrude/loft/sweep won't run.** Extrude/revolve need a *closed* profile; loft needs 2+ sketches; sweep needs a profile sketch and a separate path sketch.
