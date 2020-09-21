import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { RootState } from '7-app/types';

type ItemStackProps = {
  itemClassId: number;
};

const ItemStack = ({ itemClassId }: ItemStackProps): JSX.Element => {
  const name = useSelector((state: RootState) => state.itemClasses.byId[itemClassId]?.name);
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
