import { createAction } from '@reduxjs/toolkit';

export const playerBoughtItemFromShop = createAction<{ itemId: number; sellerId: number; price: number }>(
  'player/boughtItemFromShop',
);
