import { WorldMapLayer } from '1-game-code/World/DataLayer/WorldMapLayers';
import { Color, colorInterp, getRgbColorFromTheme } from '6-ui-features/WorldMap/Color';

const colors: Color[] = [
  getRgbColorFromTheme('blueDarker'),
  getRgbColorFromTheme('blueLighter'),
  [200, 198, 164, 255],
  [61, 171, 80, 255],
  getRgbColorFromTheme('gray'),
  getRgbColorFromTheme('white'),
];

function colorElevation(elev: number): Color {
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

function colorPop(pop: number): Color {
  if (pop < 60) {
    return colorInterp(pop, 0, 60, colors[0], colors[2]);
  }
  return colors[2];
}

export const layersUiData: Readonly<
  Readonly<{
    text: string;
    key: WorldMapLayer;
    coloringFunc: (num: number) => Color;
  }>[]
> = [
  { text: 'Elevation', key: 'elevation', coloringFunc: colorElevation },
  { text: 'Rainfall', key: 'rain', coloringFunc: colorElevation },
  { text: 'Population', key: 'population', coloringFunc: colorPop },
] as const;
