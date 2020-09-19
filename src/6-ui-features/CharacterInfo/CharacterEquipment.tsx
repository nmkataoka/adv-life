import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { RootState } from '../../7-app/types';
import useUILoop from '../useUILoop';
import { updatePlayerInventoryFromEngine } from '../Player/playerSlice';

const engineActions = [updatePlayerInventoryFromEngine];

const CharacterEquipment = (): JSX.Element => {
  useUILoop(engineActions);
  const playerGold = useSelector((state: RootState) => state.player.inventory.gold);
  return (
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
      <BottomRow>Gold: {playerGold}g</BottomRow>
    </LeftHalf>
  );
};

export default CharacterEquipment;

const LeftHalf = styled.div`
  border-right: 1px solid #c0c0c0;
  flex: 0 1 auto;
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

const BottomRow = styled.div`
  display: flex;
  width: 100%;
  padding: 1em 0;
`;
