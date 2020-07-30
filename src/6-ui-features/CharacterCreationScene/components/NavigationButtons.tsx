import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { clickedNext, clickedPrevious } from '../characterCreationSlice';

export default function NavigationButtons(): JSX.Element {
  const dispatch = useDispatch();

  return (
    <ButtonRow>
      <Button onClick={() => dispatch(clickedPrevious())}>Previous</Button>
      <Button onClick={() => dispatch(clickedNext())}>Next</Button>
    </ButtonRow>
  );
}

const ButtonRow = styled.div`
  position: absolute;
  bottom: 1em;
  display: flex;
  margin-top: 1em;
  box-sizing: border-box;
  width: calc(100% - 2em);
`;

const Button = styled.button`
  flex: 1 1 50%;
  margin: 0 1em;
  padding: 1em;
`;
