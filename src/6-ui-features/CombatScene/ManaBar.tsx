/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';

type ManaBarProps = {
  mana: number;
  maxMana: number;
};

export default function ManaBar({ mana, maxMana }: ManaBarProps) {
  return (
    <Container>
      <Mana style={{ width: `${((mana * 100) / maxMana).toFixed(0)}%` }} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100px;
  height: 12px;
  border: 1px solid gray;
`;

const Mana = styled.div`
  background-color: blue;
`;
