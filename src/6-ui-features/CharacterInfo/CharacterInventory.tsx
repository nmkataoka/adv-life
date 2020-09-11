import React from 'react';
import styled from '@emotion/styled';

const items = ['Sword', 'Shield', 'Potion', 'Steak', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

const CharacterInventory = (): JSX.Element => (
  <RightHalf>
    <h3>Character Inventory</h3>
    <ItemRow>
      {items.map((item, idx) => <ItemBox key={idx}>{item}</ItemBox>)}
    </ItemRow>
  </RightHalf>
);

export default CharacterInventory;

const RightHalf = styled.div`
  flex: 1 1 50%;
  padding: 1em;
  text-align: center;
`;

const ItemRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

const ItemBox = styled.div`
  align-items: center;
  border: 1px solid #c0c0c0;
  display: flex;
  height: 5em;
  justify-content: center;
  margin: 0.1em;
  width: 5em;
`;
