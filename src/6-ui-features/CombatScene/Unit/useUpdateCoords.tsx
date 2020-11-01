import { useCallback, RefObject } from 'react';
import { useDispatch } from 'react-redux';
import useTimeoutLoop from '5-react-components/useTimeoutLoop';
import { updatedUnitCoords } from '../combatSceneSlice';
import { getCoordsFromElement } from '../RelativePosCoords';

// Updates a unit's coords (relative to nearest position:relative parent) in redux
export default function useUpdateCoords(handle: number, unitRef: RefObject<HTMLDivElement>): void {
  const dispatch = useDispatch();

  const updateCoords = useCallback(() => {
    if (unitRef && unitRef.current) {
      const coords = getCoordsFromElement(unitRef.current);
      dispatch(updatedUnitCoords({ entityHandle: handle, coords }));
    }
  }, [dispatch, unitRef, handle]);

  // Since there is no good event listener for this, we will poll
  useTimeoutLoop(updateCoords, 100);
}
