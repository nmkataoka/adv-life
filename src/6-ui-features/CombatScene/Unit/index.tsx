/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import {
  useRef, useState, useEffect,
} from 'react';
import HealthBar from '../HealthBar';
import { RootState } from '../../../7-app/types';
import { setSkillTarget, clickedOnUnit } from '../combatSceneSlice';
import ArrowFromUnitToMouse from '../ArrowFromUnitToMouse';
import ManaBar from '../ManaBar';
import { damageBlinkCss } from '5-react-components/arrow/damageBlink';
import RecoveryBar from '../RecoveryBar';
import Arrow from '5-react-components/arrow';
import useUpdateCoords from './useUpdateCoords';

type UnitProps = {
  handle: number;
};

// milliseconds to blink the unit after taking damage
const blinkOnDamageFor = 1000;

const targetCoordsSelector = (entityHandle: number) => (state: RootState) => {
  const { combatScene } = state;
  const { units: { [entityHandle]: { targetEntity } } } = combatScene;
  const { unitCoords: { [targetEntity]: targetCoords = undefined } } = combatScene;
  return targetCoords;
};

export default function Unit({ handle }: UnitProps): JSX.Element {
  const dispatch = useDispatch();

  const {
    health,
    mana,
    maxMana,
    maxHealth,
    isEnemy,
    isStealthed,
  } = useSelector(
    (state: RootState) => state.combatScene.units[handle],
  );
  const [prevHealth, setPrevHealth] = useState(health ?? 0);
  const [recentlyTookDamage, setRecentlyTookDamage] = useState(false);
  const [tookDamageTimeout, setTookDamageTimeout] = useState(null as NodeJS.Timeout | null);

  useEffect(() => {
    if (health === prevHealth) return;

    // When the unit takes damage, show the damage animation
    if (health < prevHealth) {
      if (!recentlyTookDamage) setRecentlyTookDamage(true);
      if (tookDamageTimeout) clearTimeout(tookDamageTimeout);

      setTookDamageTimeout(
        setTimeout(() => {
          setRecentlyTookDamage(false);
        }, blinkOnDamageFor),
      );
    }
    setPrevHealth(health);
  }, [health, prevHealth, tookDamageTimeout, recentlyTookDamage]);

  const unitRef = useRef<HTMLDivElement>(null);
  useUpdateCoords(handle, unitRef);

  const targetCoords = useSelector(targetCoordsSelector(handle));
  const showAllTargetArrows = useSelector((state: RootState) => state.combatScene.showAllTargeting);
  const myCoords = useSelector((state: RootState) => state.combatScene.unitCoords[handle]);

  const selectedUnit = useSelector((state: RootState) => state.combatScene.selectedUnit);
  const selectedAction = useSelector((state: RootState) => state.combatScene.selectedAction);

  const handleUnitClick = () => {
    if (selectedAction && selectedUnit) {
      setSkillTarget(selectedUnit, [handle], selectedAction);
      dispatch(clickedOnUnit(handle));
    } else {
      dispatch(clickedOnUnit(handle));
    }
  };

  const isSelectedUnit = handle === selectedUnit;
  const showArrowFromUnitToMouse = isSelectedUnit && !isEnemy && selectedAction;
  const showCurTargetArrow = showAllTargetArrows && targetCoords;

  return (
    <Container isStealthed={isStealthed}>
      {showArrowFromUnitToMouse && <ArrowFromUnitToMouse fromRef={unitRef} />}
      {showCurTargetArrow && targetCoords && <Arrow from={myCoords} to={targetCoords} />}
      <HealthBar health={health / maxHealth} />
      <ManaBar mana={mana} maxMana={maxMana} />
      <RecoveryBar handle={handle} />
      <Circle
        css={recentlyTookDamage ? damageBlinkCss : undefined}
        ref={unitRef}
        isEnemy={isEnemy}
        onClick={handleUnitClick}
        isSelected={selectedUnit === handle}
        anActionIsSelected={!!selectedAction}
      >
        UNIT
      </Circle>
    </Container>
  );
}

type ContainerProps = {
  isStealthed: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 1em;
  ${(props: ContainerProps) => props.isStealthed && 'opacity: 0.3;'}
`;

type CircleProps = {
  isEnemy?: boolean;
  isSelected?: boolean;
  anActionIsSelected: boolean;
};

const Circle = styled.div`
  border-radius: 50%;
  background-color: ${(props: CircleProps) => (props.isEnemy ? 'red' : 'lightblue')};
  ${(props) => props.isSelected && 'outline: 2px solid lightgreen;'}
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    ${(props) => props.anActionIsSelected && 'outline: 2px solid blue;'}
  }
`;
