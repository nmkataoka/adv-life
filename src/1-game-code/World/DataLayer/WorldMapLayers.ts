export const WorldMapLayers = ['elevation', 'hilliness', 'rain', 'temp', 'population'] as const;
export type WorldMapLayer = typeof WorldMapLayers[number];
