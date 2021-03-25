import { selectorNode } from '4-react-ecsal';
import { getWorldMap } from './getWorldMap';

export const getElevationMetadata = selectorNode({
  get: ({ get }) => {
    const [worldMapCmpt] = get(getWorldMap);
    if (!worldMapCmpt) return undefined;
    const result = worldMapCmpt.data.metadata.elevation;
    return result ? { ...result } : undefined;
  },
});
