import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { RootState } from '../../7-app/types';

const CombatLog = (): JSX.Element => {
  const combatLogEntries = useSelector((state: RootState) => state.combatLog.entries);
  return (
    <ReverserWrapper>
      <InnerWrapper>
        {combatLogEntries.map(
          /* the idx in the key should be removed once timestamps
          /* are associated with the entries to make them unique */
          /* eslint-disable-next-line react/no-array-index-key */
          (entry, idx) => <Entry key={`${entry}_${idx}`}>{entry}</Entry>,
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
