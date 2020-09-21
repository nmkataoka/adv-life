import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { RootState } from '7-app/types';

const selectedUnitInfoSelector = (state: RootState) => {
  const { selectedUnit } = state.combatScene;
  if (selectedUnit == null) return undefined;
  return state.combatScene.units[selectedUnit];
};

export default function InfoSidebar() {
  const unit = useSelector(selectedUnitInfoSelector);

  if (unit == null) return <Container />;

  const {
    health,
    maxHealth,
    mana,
    maxMana,
    isChanneling,
    channelRemaining,
    channelTotalDuration,
    recoveryRemaining,
    recoveryTotalDuration,
    isRecovering,
  } = unit;

  return (
    <Container>
      Unit Info
      <div>{`Health: ${health} / ${maxHealth}`}</div>
      <div>{`Mana: ${mana} / ${maxMana}`}</div>
      {isChanneling && (
        <div>
          {`Channeling: ${(100 * (1 - channelRemaining / channelTotalDuration)).toFixed(2)}%`}
        </div>
      )}
      {isRecovering && (
        <div>
          {`Recovering: ${((100 * recoveryRemaining) / recoveryTotalDuration).toFixed(2)}%`}
        </div>
      )}
      <div />
    </Container>
  );
}

const Container = styled.div`
  width: 300px;
  background-color: lightgray;
  display: flex;
  flex-direction: column;
  padding: 2em 1em;
`;
