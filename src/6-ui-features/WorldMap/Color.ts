import { defaultTheme, getColor } from '6-ui-features/Theme';

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

/**
 * Converts a hex string to an [R, G, B] array of ints
 */
function getRgbFromHex(hex: string): readonly [number, number, number] {
  if (hex.length !== 7) throw new Error('Expected hex string to be 7 chars long.');

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b] as const;
}

export function getRgbColorFromTheme(
  color: keyof typeof defaultTheme['colors'],
): [number, number, number, number] {
  const [r, g, b] = getRgbFromHex(getColor(color)({ theme: defaultTheme }));
  return [r, g, b, 255];
}
