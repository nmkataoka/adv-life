import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { RootState } from '../../7-app/types';

type ItemStackProps = {
  itemClassId: number;
  onDoubleClick: () => void;
  publicSalePrice: number;
  stackCount: number;
};

const ItemStack = ({
  itemClassId,
  publicSalePrice,
  // stackCount,
  onDoubleClick,
}: ItemStackProps): JSX.Element => {
  const name = useSelector((state: RootState) => state.itemClasses.byId[itemClassId]?.name);
  return (
    <ItemContainer onDoubleClick={onDoubleClick}>
      <h4>{name || 'Unknown'}</h4>
      <h4>{`${publicSalePrice}g`}</h4>
    </ItemContainer>
  );
};

export default ItemStack;

const ItemContainer = styled.div`
  border: 1px solid #c0c0c0;
  display: flex;
  justify-content: space-between;
  margin: 0.2em 0.4em;
  padding: 1em 0.5em;
`;