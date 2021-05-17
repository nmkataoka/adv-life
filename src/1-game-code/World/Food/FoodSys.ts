import { createEventSlice } from '0-engine';
import { WorldMapCmpt } from '../WorldMapCmpt';
import { createFoodLayer } from './createFoodLayer';

// eslint-disable-next-line
export interface FoodGenParams {}

const createFoodLayerSlice = createEventSlice('createFood', {
  writeCmpts: [WorldMapCmpt],
})<FoodGenParams>(
  ({
    componentManagers: {
      writeCMgrs: [worldMapMgr],
    },
  }) => {
    const worldMap = worldMapMgr.getUniqueMut().data;
    const elevLayer = worldMap.dataLayers.elevation;
    const rainLayer = worldMap.dataLayers.rain;
    if (!elevLayer) {
      throw new Error('Elevation layer must be generated before Food layer.');
    }
    if (!rainLayer) {
      throw new Error('Rain layer must be generated before Food layer.');
    }

    worldMap.dataLayers.food = createFoodLayer(elevLayer, rainLayer);
  },
);

export const { createFood } = createFoodLayerSlice;

export default [createFoodLayerSlice.eventListener];
