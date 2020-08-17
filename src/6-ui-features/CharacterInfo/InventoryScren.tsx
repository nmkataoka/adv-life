import React from 'react';
import styled from '@emotion/styled';

const items = ['Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item'];

const InventoryScreen = (): JSX.Element => (
  <Container>
    <TwoHalves>
      <LeftHalf>
        <h3>Player Name</h3>
        <ItemRow>
          <ItemBox>Helmet</ItemBox>
        </ItemRow>
        <ItemRow>
          <ItemBox>Sword</ItemBox>
          <ItemBox>Plate Mail</ItemBox>
          <ItemBox>Shield</ItemBox>
        </ItemRow>
        <ItemRow>
          <ItemBox>Greaves</ItemBox>
        </ItemRow>
        <ItemRow>
          <ItemBox>Boots</ItemBox>
        </ItemRow>
      </LeftHalf>
      <RightHalf>
        <h3>Inventory</h3>
        <ItemRow>
          {items.map((item, idx) => <ItemBox key={idx}>{item}</ItemBox>)}
          {items.map((item, idx) => <ItemBox key={idx + 10}>{item}</ItemBox>)}
          {items.map((item, idx) => <ItemBox key={idx + 20}>{item}</ItemBox>)}
          {items.map((item, idx) => <ItemBox key={idx + 30}>{item}</ItemBox>)}
        </ItemRow>
      </RightHalf>
    </TwoHalves>
  </Container>
);

export default InventoryScreen;

const Container = styled.div`
  min-width: 70em;
`;

const TwoHalves = styled.div`
  align-items: stretch;  
  display: flex;
`;

const LeftHalf = styled.div`
  border-right: 1px solid #c0c0c0;
  flex: 0 1 auto;
  padding: 1em;
  text-align: center;
`;

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
