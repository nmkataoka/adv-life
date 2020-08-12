import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import PauseButton from './PauseButton';
import ShowAllTargetingButton from './ShowAllTargetingButton';
import WorldMapButton from './WorldMapButton';
import { RootState } from '../../7-app/types';

const actions = ['Menu'];

export default function TopBar(): JSX.Element {
  const title = useSelector((state: RootState) => state.topBar.title);
  return (
    <Container>
      <LeftGroup>
        {actions.map((a) => (
          <ActionButton key={a}>{a}</ActionButton>
        ))}
      </LeftGroup>
      <CenterGroup>
        {title && <h2>{title}</h2>}
      </CenterGroup>
      <RightGroup>
        <WorldMapButton />
        <ShowAllTargetingButton />
        <PauseButton />
      </RightGroup>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.5em 1em;
  background-color: gold;
`;

const ActionButton = styled.div`
  border-radius: 4px;
  background-color: brown;
  color: white;
  margin-right: 0.5em;
  padding: 1em;

  &:hover {
    cursor: pointer;
  }
`;

const LeftGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  flex: 1 1 0;
`;

const CenterGroup = styled.div`
  display: flex;
  justify-content: center;
  flex: 1 1 0;
`;

const RightGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1 1 0;
`;