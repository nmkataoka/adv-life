import { useWorldMap } from '6-ui-features/WorldMap';
import { NextYearButton } from './NextYearButton';

/** This map overlay should contain UI elements specific to civ mode. */
export function CivMapOverlay(): JSX.Element | null {
  const { layerData } = useWorldMap();
  if (!layerData) return null;
  return (
    <>
      <NextYearButton />
    </>
  );
}
