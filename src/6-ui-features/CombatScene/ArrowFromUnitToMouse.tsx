import React, { RefObject } from 'react';
import { useSelector } from 'react-redux';
import Arrow from '../../5-react-components/arrow';
import { RootState } from '../../7-app/types';
import { getCoordsFromElement } from './RelativePosCoords';

type ArrowFromUnitProps = {
  fromRef: RefObject<HTMLDivElement>;
};

export default function ArrowFromUnitToMouse({ fromRef }: ArrowFromUnitProps): JSX.Element | null {
  const mousePos = useSelector((state: RootState) => state.combatScene.mousePosition);

  if (!fromRef || !fromRef.current) return null;
  const coords = getCoordsFromElement(fromRef.current);

  return (
    <Arrow
      from={coords}
      to={mousePos}
    />
  );
}
