import styled from '@emotion/styled';
import { useSelector } from '4-react-ecsal';
import { getPlayerInventory } from '3-frontend-api';
import CharacterEquipment from './CharacterEquipment';
import CharacterInventory from './CharacterInventory';

const InventoryScreen = (): JSX.Element => {
  const { inventorySlots } = useSelector(getPlayerInventory);
  return (
    <Container>
      <TwoHalves>
        <CharacterEquipment />
        <CharacterInventory inventorySlots={inventorySlots} />
      </TwoHalves>
    </Container>
  );
};
export default InventoryScreen;

const Container = styled.div`
  min-width: 70em;
`;

const TwoHalves = styled.div`
  align-items: stretch;
  display: flex;
`;
