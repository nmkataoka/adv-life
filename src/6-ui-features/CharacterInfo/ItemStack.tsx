import styled from '@emotion/styled';
import { useItemClass } from '3-frontend-api';

type ItemStackProps = {
  itemClassId: number;
};

const ItemStack = ({ itemClassId }: ItemStackProps): JSX.Element => {
  const { name } = useItemClass(itemClassId);
  return <ItemBox>{name}</ItemBox>;
};

const ItemBox = styled.div`
  align-items: center;
  border: 1px solid #c0c0c0;
  display: flex;
  height: 5em;
  justify-content: center;
  margin: 0.1em;
  width: 5em;
`;

export default ItemStack;
