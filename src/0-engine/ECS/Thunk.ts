import { EntityManager } from './EntityManager';
import { EventAction } from './event-system';

export interface Thunk {
  (dispatch: ThunkDispatch, eMgr: EntityManager): Promise<void>;
}

export interface ThunkDispatch {
  (thunkAction: Thunk): Promise<void>;
  <A extends EventAction<any>>(action: A): Promise<void>;
}
