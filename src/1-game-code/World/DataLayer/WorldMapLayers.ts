export const WorldMapLayers = ['elevation', 'hilliness', 'rain', 'temp'] as const;
export type WorldMapLayer = typeof WorldMapLayers[number];
