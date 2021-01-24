import { defaultTheme, getColor } from '6-ui-features/Theme';
import { Color, colorInterp } from './Color';

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

function getRgbColorFromTheme(
  color: keyof typeof defaultTheme['colors'],
): [number, number, number, number] {
  const [r, g, b] = getRgbFromHex(getColor(color)({ theme: defaultTheme }));
  return [r, g, b, 255];
}

const colors: Color[] = [
  getRgbColorFromTheme('blueDarker'),
  getRgbColorFromTheme('blueLighter'),
  [200, 198, 164, 255],
  [61, 171, 80, 255],
  getRgbColorFromTheme('gray'),
  getRgbColorFromTheme('white'),
];

export function colorElevation(elev: number): Color {
  if (elev < -5000) {
    return colors[0];
  }
  if (elev < 0) {
    return colorInterp(elev, -5000, 0, colors[0], colors[1]);
  }
  if (elev < 1500) {
    return colorInterp(elev, 0, 2000, colors[2], colors[3]);
  }
  if (elev < 3000) {
    return colorInterp(elev, 2000, 4000, colors[3], colors[4]);
  }
  if (elev < 5000) {
    return colorInterp(elev, 4000, 8000, colors[4], colors[5]);
  }
  return colors[5];
}
