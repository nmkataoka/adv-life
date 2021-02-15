import styled from '@emotion/styled';
import { useSelector } from '4-react-ecsal';
import { Entity, EntityManager } from '0-engine';
import { InventoryCmpt } from '1-game-code/ncomponents';
import { getPlayerId } from '3-frontend-api';

const selectPlayerGold = (player: Entity) => (eMgr: EntityManager) => {
  const { gold } = eMgr.getCmpt(InventoryCmpt, player);
  return gold;
};

const CharacterEquipment = (): JSX.Element => {
  const playerGold = useSelector((eMgr: EntityManager) =>
    selectPlayerGold(getPlayerId(eMgr))(eMgr),
  );
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
