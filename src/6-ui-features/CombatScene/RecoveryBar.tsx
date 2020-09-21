import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { RootState } from '7-app/types';

export type RecoveryBarProps = {
  handle: number;
};

export default function RecoveryBar({ handle }: RecoveryBarProps) {
  const {
    isRecovering,
    recoveryRemaining,
    recoveryTotalDuration,
    isChanneling,
    channelRemaining,
    channelTotalDuration,
  } = useSelector((state: RootState) => state.combatScene.units[handle]);

  let widthFrac = 0;
  if (isChanneling) {
    widthFrac = 1 - channelRemaining / channelTotalDuration;
  } else if (isRecovering) {
    widthFrac = recoveryRemaining / recoveryTotalDuration;
  }
  const width = `${(100 * widthFrac).toFixed(2)}%`;

  const backgroundColor = isChanneling ? 'yellow' : 'lightgray';
  return (
    <Container>
      <Recovery style={{ width, backgroundColor }} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100px;
  height: 6px;
  border: 1px solid gray;
`;

const Recovery = styled.div`
  border-right: 1px solid gray;
`;
