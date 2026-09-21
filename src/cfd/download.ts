/**
 * Download the active CFD tab as an OpenFOAM case zip.
 * Implemented in Phase 2 (caseGen + namedStl + zip); this module is the store's
 * lazy-import seam so store.ts doesn't take a hard dependency on the generator.
 */
import type { AppState } from "../store";

export async function downloadCfdCaseZip(
  get: () => AppState,
): Promise<void> {
  const { generateAndDownloadCase } = await import("./caseGen");
  await generateAndDownloadCase(get);
}
