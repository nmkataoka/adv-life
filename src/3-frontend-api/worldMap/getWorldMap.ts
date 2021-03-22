import { DataLayer } from '1-game-code/World';
import { WorldMapCmpt } from '1-game-code/World/WorldMapCmpt';
import { selectorNodeFamily, uniqueComponentNode } from '4-react-ecsal';

export const getWorldMap = uniqueComponentNode(WorldMapCmpt);

export const getWorldMapLayer = selectorNodeFamily({
  get: (layer: string) => ({ get }) => {
    const [worldMapCmpt] = get(getWorldMap);
    if (!worldMapCmpt) return undefined;
    const dataLayer = DataLayer.constructFrom(worldMapCmpt.data.dataLayers[layer] as DataLayer);
    return dataLayer;
  },
  computeKey: (layer: string) => layer,
});
