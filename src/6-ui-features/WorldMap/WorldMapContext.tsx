import { createContext, RefObject, ReactNode, useContext, useRef, useState } from 'react';
import { WorldMapLayer } from '1-game-code/World/DataLayer/WorldMapLayers';
import { DataLayer } from '1-game-code/World';
import { getWorldMapLayer } from '3-frontend-api/worldMap';
import { useSelector2 } from '4-react-ecsal';
import { DeepReadonly } from 'ts-essentials';
import { useElementSize } from '5-react-components/useElementSize';

interface WorldMapContextValue {
  canvasRef: RefObject<HTMLCanvasElement>;
  containerRef: RefObject<HTMLDivElement>;
  containerWidth: number;
  containerHeight: number;
  layer: WorldMapLayer;
  layerData?: DeepReadonly<DataLayer>;
}
const WorldMapContext = createContext<WorldMapContextValue | undefined>(undefined);

interface WorldMapActionsContextValue {
  setLayer: (layer: WorldMapLayer) => void;
}
const WorldMapActionsContext = createContext<WorldMapActionsContextValue | undefined>(undefined);

export function WorldMapProvider({ children }: { children?: ReactNode }): JSX.Element {
  const [layer, setLayer] = useState<WorldMapLayer>('elevation');
  const layerData = useSelector2(getWorldMapLayer(layer));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, height] = useElementSize(containerRef);

  return (
    <WorldMapActionsContext.Provider value={{ setLayer }}>
      <WorldMapContext.Provider
        value={{
          containerHeight: height,
          containerRef,
          containerWidth: width,
          canvasRef,
          layer,
          layerData,
        }}
      >
        {children}
      </WorldMapContext.Provider>
    </WorldMapActionsContext.Provider>
  );
}

/** Contains world map state (UI only). World map game state should be fetched directly from the engine. */
export function useWorldMap(): WorldMapContextValue {
  const worldMapContextValue = useContext(WorldMapContext);
  if (!worldMapContextValue) {
    throw new Error('useWorldMap must be inside a valid WorldMapProvider.');
  }
  return worldMapContextValue;
}

export function useWorldMapActions(): WorldMapActionsContextValue {
  const worldMapActionsContextValue = useContext(WorldMapActionsContext);
  if (!worldMapActionsContextValue) {
    throw new Error('useWorldMapActions must be inside a valid WorldMapProvider.');
  }
  return worldMapActionsContextValue;
}
