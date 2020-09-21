import React, { useState } from 'react';
import styled from '@emotion/styled';
import Modal from '5-react-components/Modal';
import InventoryScreen from '../CharacterInfo/InventoryScreen';

const PartyMember = (): JSX.Element => {
  const [showInventory, setShowInventory] = useState(false);

  const handleClick = () => {
    setShowInventory(true);
  };

  return (
    <>
      <Modal isShowing={showInventory} onClose={() => setShowInventory(false)}>
        <InventoryScreen />
      </Modal>
      <Container onClick={handleClick}>
        <h2>Player Name</h2>
      </Container>
    </>
  );
};

export default PartyMember;

const Container = styled.div`
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  margin: 1em 0.5em;
  padding: 1em;

  &:hover {
    cursor: pointer;
  }
`;
