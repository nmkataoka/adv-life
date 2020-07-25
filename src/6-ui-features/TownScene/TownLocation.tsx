import React, { useState } from 'react';
import styled from '@emotion/styled';
import Modal from '../../5-react-components/Modal';

type TownLocationProps = {
  name: string;
}

export default function TownLocation({ name }: TownLocationProps): JSX.Element {
  const [isShowing, setIsShowing] = useState(false);
  return (
    <div>
      <Modal isShowing={isShowing} onClose={() => setIsShowing(false)}>
        <ModalContent>
          <h1>{name}</h1>
          Buy stuff!
        </ModalContent>
      </Modal>
      <Container onClick={() => setIsShowing(true)}>
        {name}
      </Container>
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
  border: 1px solid #c0c0c0;
  min-width: 50vw;
  min-height: 50vh;
  padding: 1em;
`;
