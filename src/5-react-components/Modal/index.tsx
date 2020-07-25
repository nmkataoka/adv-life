import React from 'react';
import styled from '@emotion/styled';

type ModalProps = {
  children: React.ReactNode,
  isShowing?: boolean,
}

export default function Modal({ children, isShowing }: ModalProps): JSX.Element | null {
  if (!isShowing) return null;

  return (
    <Container>
      <CloseButton>X</CloseButton>
      {children}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  z-index: 1;
`;

const CloseButton = styled.button`
  padding: 0.5em;
  position: absolute;
  top: 0;
  right: 0;
`;
