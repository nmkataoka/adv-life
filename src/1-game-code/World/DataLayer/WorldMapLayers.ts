export const WorldMapLayers = ['elevation', 'hilliness', 'rain', 'temp', 'food'] as const;
export type WorldMapLayer = typeof WorldMapLayers[number];
