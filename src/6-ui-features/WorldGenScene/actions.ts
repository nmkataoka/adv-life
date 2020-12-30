import { createWorldMap } from '1-game-code/World/TerrainGen/TerrainGenSys';
import { AppThunk } from '7-app/types';
import apiClient from '3-frontend-api/ApiClient';

export const startWorldGen = (payload: {
  numPlates: number;
  size: { x: number; y: number };
}): AppThunk => async () => {
  // This is temporary, we'll make a world gen area later.
  // Recommended settings
  // await apiClient.emit(createWorldMap({ numPlates: 12, size: { x: 800, y: 400 } }));

  // Smaller settings for tests
  await apiClient.emit(createWorldMap(payload));
};
