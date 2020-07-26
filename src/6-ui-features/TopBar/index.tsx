import React from 'react';
import styled from '@emotion/styled';
import PauseButton from './PauseButton';
import ShowAllTargetingButton from './ShowAllTargetingButton';
import WorldMapButton from './WorldMapButton';

const actions = ['Menu'];

export default function TopBar(): JSX.Element {
  return (
    <Container>
      {actions.map((a) => (
        <ActionButton key={a}>{a}</ActionButton>
      ))}
      <ButtonGroup>
        <WorldMapButton />
        <ShowAllTargetingButton />
        <PauseButton />
      </ButtonGroup>
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

const ButtonGroup = styled.div`
  display: flex;
`;
