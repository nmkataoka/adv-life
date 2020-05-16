import { createAction } from '@reduxjs/toolkit';

export const keyPressed = createAction<number>('common/keyPressed');
