import { Color, colorInterp } from './Color';

const colors: Color[] = [
  [0, 5, 70, 255],
  [0, 55, 120, 255],
  [0, 119, 190, 255],
  [137, 207, 245, 255],
  [200, 198, 164, 255],
  [155, 177, 125, 255],
  // [220, 230, 220, 220],
  [119, 119, 119, 255],
  [238, 238, 238, 238],
];

export function colorElevation(elev: number): Color {
  if (elev < -7000) {
    return colors[0];
  }
  if (elev < -5000) {
    return colorInterp(elev, -7000, -5000, colors[0], colors[1]);
  }
  if (elev < -2000) {
    return colorInterp(elev, -5000, -2000, colors[1], colors[2]);
  }
  if (elev < 0) {
    return colorInterp(elev, -2000, 0, colors[2], colors[3]);
  }
  if (elev < 2000) {
    return colorInterp(elev, 0, 2000, colors[4], colors[5]);
  }
  if (elev < 4000) {
    return colorInterp(elev, 2000, 4000, colors[5], colors[6]);
  }
  if (elev < 8000) {
    return colorInterp(elev, 4000, 8000, colors[6], colors[7]);
  }
  return colors[7];
}
