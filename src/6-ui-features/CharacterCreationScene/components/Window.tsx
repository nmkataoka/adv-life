import React from 'react';
import styled from '@emotion/styled';
import NavigationButtons from './NavigationButtons';

type WindowProps = {
  children?: React.ReactNode,
  showNavigation?: boolean,
}

export default function Window({ children, showNavigation }: WindowProps): JSX.Element {
  return (
    <WindowDiv>
      {children}
      {showNavigation && <NavigationButtons />}
    </WindowDiv>
  );
}

const WindowDiv = styled.div`
  background-color: #eee;
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  position: relative;
  width: 30vw;
  max-width: 30em;
  height: 800px;
  overflow-y: auto;
  padding: 1em;
  padding-bottom: 3em;
`;
