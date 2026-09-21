/**
 * Start / cancel a CFD job against the local /api/cfd runner.
 * Implemented in Phase 4; this module is the store's lazy-import seam.
 */
import type { AppState } from "../store";

type SetState = (
  partial: Partial<AppState> | ((s: AppState) => Partial<AppState>),
) => void;

export async function startCfdJob(
  get: () => AppState,
  set: SetState,
): Promise<void> {
  const { submitAndPoll } = await import("./runLoop");
  await submitAndPoll(get, set);
}

export async function cancelCfdJob(
  get: () => AppState,
  set: SetState,
): Promise<void> {
  const { cancelActive } = await import("./runLoop");
  await cancelActive(get, set);
}
