/** Google turbo colormap, t in [0,1] → RGB 0..1. Shared with Viewport overlay. */
export function turboColor(t: number): [number, number, number] {
  const x = Math.min(1, Math.max(0, t));
  const r =
    0.13572138 +
    4.6153926 * x -
    42.66032258 * x ** 2 +
    132.13108234 * x ** 3 -
    152.94239396 * x ** 4 +
    59.28637943 * x ** 5;
  const g =
    0.09140261 +
    2.19454389 * x +
    4.84296658 * x ** 2 -
    14.18503333 * x ** 3 +
    4.27729857 * x ** 4 +
    2.82956604 * x ** 5;
  const b =
    0.1066733 +
    12.64194608 * x -
    60.58204836 * x ** 2 +
    110.36276771 * x ** 3 -
    89.90310912 * x ** 4 +
    27.34824973 * x ** 5;
  return [
    Math.min(1, Math.max(0, r)),
    Math.min(1, Math.max(0, g)),
    Math.min(1, Math.max(0, b)),
  ];
}

export const PATCH_COLORS: Record<string, [number, number, number]> = {
  inlet: [0.2, 0.8, 0.35],
  outlet: [0.9, 0.25, 0.25],
  wall: [0.55, 0.55, 0.58],
  movingWall: [0.75, 0.4, 0.15],
  symmetry: [0.3, 0.75, 0.85],
  freestream: [0.35, 0.5, 0.95],
};
