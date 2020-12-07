import React from 'react';
import styled from '@emotion/styled';
import ColosseumActionButton from './ColosseumActionButton';

const actions = ['Spawn Enemy', 'Kill Enemies'];

export default function ColosseumActionBar(): JSX.Element {
  return (
    <Container>
      <Centered>
        {actions.map((name) => (
          <ColosseumActionButton key={name} name={name} />
        ))}
      </Centered>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
`;

const Centered = styled.div`
  display: flex;
  flex-direction: column;
`;
