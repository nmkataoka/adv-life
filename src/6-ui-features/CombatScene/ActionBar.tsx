/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";

const actions = ["Attack", "Defend", "Flee", "Fireball", "Potion"];

export default function ActionBar() {
  return (
    <Container>
      {actions.map((a) => (
        <ActionButton key={a}>{a}</ActionButton>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 0.5em 1em;
  background-color: gold;
  position: absolute;
  bottom: 0;
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
