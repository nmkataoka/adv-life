import React from 'react';
import styled from '@emotion/styled';

type ActionButtonProps = {
  displayText: string;
};

export default function ActionButton({ displayText }: ActionButtonProps): JSX.Element {
  return <ActionButtonContainer>{displayText}</ActionButtonContainer>;
}

const ActionButtonContainer = styled.div`
  border-radius: 4px;
  background-color: brown;
  color: white;
  margin-right: 0.5em;
  overflow: hidden;
  padding: 1em;
  text-align: center;
  width: 7em;

  &:hover {
    cursor: pointer;
  }
`;
