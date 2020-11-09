import React from 'react';
import styled from '@emotion/styled';

type ColosseumActionButtonProps = {
  name: string;
};

export default function ColosseumActionButton({ name }: ColosseumActionButtonProps): JSX.Element {
  return <Container>{name}</Container>;
}

const Container = styled.button`
  border: 1px solid #c0c0c0;
  border-radius: 2px;
  margin: 0.25em 0.5em;
  padding: 0.5em;
`;
