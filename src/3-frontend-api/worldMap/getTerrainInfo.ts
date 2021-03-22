import { WorldMap } from '1-game-code/World/WorldMap';
import { selectorNode } from '4-react-ecsal';
import { getWorldMap } from './getWorldMap';

export const getElevationMetadata = selectorNode({
  get: ({ get }) => {
    const [worldMapCmpt] = get(getWorldMap);
    if (!worldMapCmpt) return undefined;
    const result = worldMapCmpt.data.metadata[WorldMap.Layer.Elevation];
    return result ? { ...result } : undefined;
  },
});
