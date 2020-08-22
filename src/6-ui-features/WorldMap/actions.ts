import { createAction } from '@reduxjs/toolkit';

export type TravelToLocationPayload = {
  id: number,
  locationType: 'Combat' | 'Town'
}

export const travelToLocation = createAction<TravelToLocationPayload>('worldMap/travelToLocation');
