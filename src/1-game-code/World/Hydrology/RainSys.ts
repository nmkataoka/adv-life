import { createEventSlice } from '0-engine';
import { WorldMap } from '../WorldMap';
import { WorldMapCmpt } from '../WorldMapCmpt';
import { createConstantRainLayer } from './rainLayer';

const startHydrologySlice = createEventSlice('startHydrology', {
  writeCmpts: [WorldMapCmpt],
})<{ size: { x: number; y: number } }>(
  ({
    componentManagers: {
      writeCMgrs: [worldMapMgr],
    },
    payload: {
      size: { x, y },
    },
  }) => {
    const worldMapCmpt = worldMapMgr.getUniqueMut();
    if (!worldMapCmpt) {
      throw new Error('Need a world map to create hydrology layer.');
    }
    if (worldMapCmpt.data.dataLayers[WorldMap.Layer.Rain]) {
      throw new Error('Tried to create a hydrology layer when it already exists');
    }
    worldMapCmpt.data.dataLayers[WorldMap.Layer.Rain] = createConstantRainLayer(x, y);
  },
);

// const rainSlice = createEventSlice('rain', {
//   writeCmpts: [WorldMapCmpt],
// })<void>(
//   ({
//     componentManagers: {
//       writeCMgrs: [worldMapMgr],
//     },
//   }) => {
//     const worldMapCmpt = worldMapMgr.getUniqueMut();
//     const rainLayer = worldMapCmpt.data.dataLayers[WorldMap.Layer.Rain];
//   },
// );

export const { startHydrology } = startHydrologySlice;
// export const { rain } = rainSlice;

export default [startHydrologySlice.eventListener /* , rainSlice.eventListener */];
