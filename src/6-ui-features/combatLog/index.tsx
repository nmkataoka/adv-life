import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { RootState } from '../../7-app/types';

const CombatLog = () => {
  const combatLogEntries = useSelector((state: RootState) => state.combatLog.entries);
  return (
    <ReverserWrapper>
      <InnerWrapper>
        {combatLogEntries.map(
          (entry) => <Entry key={entry}>{entry}</Entry>,
        )}
      </InnerWrapper>
    </ReverserWrapper>
  );
};

export default CombatLog;

const ReverserWrapper = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
  height: 15em;
  background-color: lightgray;
  padding: 1em;
  border: 1px solid gray;
`;

const InnerWrapper = styled.div``;

const Entry = styled.div`
  padding: 0.1em 0;
`;
