export type Color = [number, number, number, number];

export function colorInterp(
  val: number,
  min: number,
  max: number,
  color1: Color,
  color2: Color,
): Color {
  const frac = (val - min) / (max - min);
  const [r1, g1, b1, a1] = color1;
  const [r2, g2, b2, a2] = color2;
  return [
    (r2 - r1) * frac + r1,
    (g2 - g1) * frac + g1,
    (b2 - b1) * frac + b1,
    (a2 - a1) * frac + a1,
  ];
}
