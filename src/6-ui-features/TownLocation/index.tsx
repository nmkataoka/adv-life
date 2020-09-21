import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import Modal from '5-react-components/Modal';
import { RootState } from '../../7-app/types';
import ShopInventory from './ShopInventory';

type TownLocationProps = {
  townLocationId: number;
};

const defaultTownInfo = {
  name: 'Unnamed',
};

export default function TownLocation({ townLocationId }: TownLocationProps): JSX.Element {
  const [isShowing, setIsShowing] = useState(false);
  const { name } = useSelector(
    (state: RootState) => state.townLocations.byId[townLocationId] || defaultTownInfo,
  );

  return (
    <div>
      <Modal isShowing={isShowing} onClose={() => setIsShowing(false)}>
        <ModalContent>
          <h1>{name}</h1>
          <ShopInventory townLocationId={townLocationId} />
        </ModalContent>
      </Modal>
      <Container onClick={() => setIsShowing(true)}>{name}</Container>
    </div>
  );
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
`;

const ModalContent = styled.div`
  background-color: white;
  min-width: 50vw;
  min-height: 50vh;
`;
