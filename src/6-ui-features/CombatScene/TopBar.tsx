/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import PauseButton from './PauseButton';

const actions = ['Menu', 'Map'];

export default function TopBar() {
  return (
    <Container>
      {actions.map((a) => (
        <ActionButton key={a}>{a}</ActionButton>
      ))}
      <PauseButton />
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
