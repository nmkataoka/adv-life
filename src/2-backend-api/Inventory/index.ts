import { Thunk } from '0-engine';
import { holdItemFromInventory, wearItemFromInventory } from '1-game-code/Inventory/EquipmentSys';
import apiClient from '3-frontend-api/ApiClient';

export const holdItem = (payload: { itemIndex: number }): Thunk => (dispatch) =>
  dispatch(holdItemFromInventory({ ...payload, agentId: apiClient.headers.userId }));

export const wearItem = (payload: { itemIndex: number }): Thunk => (dispatch) =>
  dispatch(wearItemFromInventory({ ...payload, agentId: apiClient.headers.userId }));
