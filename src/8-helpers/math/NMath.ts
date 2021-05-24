/** Returns value if between min and max, otherwise returns min or max */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export default {
  clamp,
};
