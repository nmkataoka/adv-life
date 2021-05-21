import React, { useState } from 'react';
import styled from '@emotion/styled';
import Modal from '5-react-components/Modal';
import { getColor } from '6-ui-features/Theme';
import { WorldMapWithCombat } from './WorldMapWithCombat';

export default function WorldMapButton(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Modal isShowing={isOpen} onClose={() => setIsOpen(false)}>
        <WorldMapWithCombat />
      </Modal>
      <Container onClick={() => setIsOpen(!isOpen)}>World Map</Container>
    </>
  );
}

const Container = styled.button`
  background-color: ${getColor('asuna')};
  color: ${getColor('black')};
`;
