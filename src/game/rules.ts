import { KEY_COUNT, LIMITS, START } from './data';
export type Point = { x: number; z: number };
export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.z - b.z);
export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export const legalPosition = (p: Point) => ({x: clamp(p.x, -LIMITS.x, LIMITS.x), z: clamp(p.z, -LIMITS.z, LIMITS.z)});
export const canOpenDreamExit = (keys: string[]) => new Set(keys.filter(k => /^key[1-6]$/.test(k))).size === KEY_COUNT;
export const detectionRadius = (sprinting: boolean, crouching: boolean, flashlight: boolean, catches: number) =>
  (sprinting ? 4.5 : crouching ? 1.55 : 2.8) + (flashlight ? 1.5 : 0) + catches * 0.35;
export const getCatchOutcome = (previousCatches: number) => previousCatches + 1 >= 3 ? 'loop' : 'caught';
export const spawnAfterCatch = () => ({ ...START });
