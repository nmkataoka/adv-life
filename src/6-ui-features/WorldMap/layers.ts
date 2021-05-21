import { WorldMapLayer } from '1-game-code/World/DataLayer/WorldMapLayers';
import { Color, colorInterp, getRgbColorFromTheme } from './Color';

const elevColors: Color[] = [
  getRgbColorFromTheme('blueDarker'),
  getRgbColorFromTheme('blueLighter'),
  [200, 198, 164, 255],
  [61, 171, 80, 255],
  getRgbColorFromTheme('gray'),
  getRgbColorFromTheme('white'),
];

function colorElevation(elev: number): Color {
  if (elev < -5000) {
    return elevColors[0];
  }
  if (elev < 0) {
    return colorInterp(elev, -5000, 0, elevColors[0], elevColors[1]);
  }
  if (elev < 2000) {
    return colorInterp(elev, 0, 2000, elevColors[2], elevColors[3]);
  }
  if (elev < 4000) {
    return colorInterp(elev, 2000, 4000, elevColors[3], elevColors[4]);
  }
  if (elev < 8000) {
    return colorInterp(elev, 4000, 8000, elevColors[4], elevColors[5]);
  }
  return elevColors[5];
}

const rainColors: Color[] = [getRgbColorFromTheme('white'), getRgbColorFromTheme('blueDarker')];

function colorRain(rain: number): Color {
  if (rain < 100) {
    return colorInterp(rain, 0, 100, rainColors[0], rainColors[1]);
  }
  return rainColors[1];
}

const foodColors: Color[] = [getRgbColorFromTheme('white'), getRgbColorFromTheme('grayDarker')];

function colorFood(pop: number): Color {
  if (pop < 60) {
    return colorInterp(pop, 0, 60, foodColors[0], foodColors[1]);
  }
  return foodColors[1];
}

export const layersUiData: Readonly<
  Readonly<{
    text: string;
    key: WorldMapLayer;
    coloringFunc: (num: number) => Color;
  }>[]
> = [
  { text: 'Elevation', key: 'elevation', coloringFunc: colorElevation },
  { text: 'Rainfall', key: 'rain', coloringFunc: colorRain },
  { text: 'Food', key: 'food', coloringFunc: colorFood },
] as const;
