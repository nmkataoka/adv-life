import { createAction } from '@reduxjs/toolkit';

export const playerBoughtItemFromShop = createAction<{
  itemIndex: number;
  sellerId: number;
  price: number;
}>('player/boughtItemFromShop');
