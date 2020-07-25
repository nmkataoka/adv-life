import React from 'react';
import styled from '@emotion/styled';

type TownLocationProps = {
  name: string;
}

export default function TownLocation({ name }: TownLocationProps): JSX.Element {
  return <Container>{name}</Container>;
}

const Container = styled.button`
  background-color: lightblue;
  border: 1px solid #c0c0c0;
  border-radius: 50%;
  height: 7em;
  outline: 0;
  padding: 1em;
  width: 7em;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;
