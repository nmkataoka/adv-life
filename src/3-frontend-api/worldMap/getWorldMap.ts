import { DataLayer } from '1-game-code/World';
import { WorldMapCmpt } from '1-game-code/World/WorldMapCmpt';
import { selectorNode, SelectorNode, uniqueComponentNode } from '4-react-ecsal';
import { DeepReadonly } from 'ts-essentials';

export const getWorldMap = uniqueComponentNode(WorldMapCmpt);

export const getWorldMapLayer = (
  layer: string,
): SelectorNode<DeepReadonly<DataLayer> | undefined> =>
  selectorNode({
    get: ({ get }) => {
      const [worldMapCmpt] = get(getWorldMap);
      if (!worldMapCmpt) return undefined;
      const dataLayer = worldMapCmpt.data.dataLayers[layer];
      return dataLayer;
    },
  });
