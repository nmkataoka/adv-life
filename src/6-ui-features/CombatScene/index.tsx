/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import Unit from './Unit';
import ActionBar from './ActionBar';
import { RootState } from '7-app/types';
import { setMousePosition, UnitInfo } from './combatSceneSlice';
import { updateUnitsFromEngine } from './actions';
import CombatLog from '../CombatLog';
import useUILoop from '../useUILoop';

import useDetectKeypress from '../common/useDetectKeypress';
import InfoSidebar from './InfoSidebar';
import { updateCombatLogFromEngine } from '../CombatLog/combatLogSlice';

function sortUnitsByCombatPosition(a: UnitInfo, b: UnitInfo) {
  return a.position - b.position;
}

const engineUpdates = [
  updateCombatLogFromEngine,
  updateUnitsFromEngine,
];

export default function CombatScene(): JSX.Element {
  const units = useSelector((state: RootState) => state.combatScene.units);
  const enemies = Object.values(units).filter((u) => u.isEnemy);
  const friendlies = Object.values(units).filter((f) => !f.isEnemy);
  const dispatch = useDispatch();
  const sceneRef = useRef<HTMLDivElement>(null);

  useUILoop(engineUpdates);

  useDetectKeypress();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const bounds = sceneRef.current?.getBoundingClientRect();
    if (bounds) {
      dispatch(setMousePosition({ x: clientX - bounds.left, y: clientY - bounds.top }));
    }
  };

  return (
    <Container onMouseMove={handleMouseMove} ref={sceneRef}>
      <MainContent>
        <Row>
          {enemies.sort(sortUnitsByCombatPosition).map((e) => (
            <Unit key={e.entityHandle} handle={e.entityHandle} />
          ))}
        </Row>
        <Divider />
        <Row>
          {friendlies.sort(sortUnitsByCombatPosition).map((p) => (
            <Unit key={p.entityHandle} handle={p.entityHandle} />
          ))}
        </Row>
        <ActionBar />
        <CombatLogContainer><CombatLog /></CombatLogContainer>
      </MainContent>
      <InfoSidebar />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  min-height: 70vh;
  align-items: stretch;
`;

const MainContent = styled.div`
  flex: 1 1 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  padding: 2em 4em;
`;

const Divider = styled.div`
  width: 100%;
  border-bottom: 2px solid gray;
`;

const CombatLogContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;
