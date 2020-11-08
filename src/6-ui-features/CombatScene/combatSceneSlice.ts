import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import throttle from 'lodash.throttle';
import { GameManager } from '0-engine/GameManager';
import { setSkillTarget as setSkillTargetApi } from '3-frontend-api';
import { UnitInfo as UnitInfoApi } from '3-frontend-api/UnitInfo';
import { DictOf } from '8-helpers/DictOf';
import { AppThunk } from '7-app/types';
import { ActionInfo, CreateActionInfo } from './ActionInfo';
import { keyPressed } from '../common/actions';
import { Keycodes } from '../common/constants';

type MousePos = {
  x: number;
  y: number;
};

export type UnitInfo = UnitInfoApi;

type UnitCoord = {
  x: number;
  y: number;
};

type UnitCoordsDict = { [key: string]: UnitCoord };

const initialState = {
  units: {} as DictOf<UnitInfo>,
  unitCoords: {} as UnitCoordsDict,

  selectedUnit: null as null | number,

  // Relative to the position: relative container
  mousePosition: { x: 0, y: 0 } as MousePos,

  actions: [
    CreateActionInfo({ name: 'attack', displayText: 'Attack' }),
    CreateActionInfo({ name: 'defend', displayText: 'Defend' }),
    CreateActionInfo({ name: 'fireball', displayText: 'Fireball', aoeRadius: 1 }),
    CreateActionInfo({ name: 'stealth', displayText: 'Stealth' }),
    CreateActionInfo({ name: 'heal', displayText: 'Heal' }),
    CreateActionInfo({ name: 'flee', displayText: 'Flee' }),
  ],
  selectedAction: undefined as ActionInfo | undefined,

  isPaused: false,
  isInCombat: false,
};

const combatSceneSlice = createSlice({
  name: 'combatScene',
  initialState,
  reducers: {
    updatedUnitCoords(state, action: PayloadAction<{ entityHandle: number; coords: UnitCoord }>) {
      const { entityHandle, coords } = action.payload;
      state.unitCoords[entityHandle] = { ...coords };
    },
    clickedOnUnit(state, action: PayloadAction<number>) {
      const handle = action.payload;
      if (state.selectedAction) {
        // If an action is selected, the target has been clicked.
        // Execute the action
        state.selectedUnit = null;
        state.selectedAction = undefined;
      } else if (state.selectedUnit === handle) {
        // Deselect a unit by clicking on it again
        state.selectedUnit = null;
        state.selectedAction = undefined;
      } else if (!state.units[handle].isEnemy) {
        // Select your own unit
        state.selectedUnit = handle;
      }
    },
    updateMousePosition(state, action: PayloadAction<{ x: number; y: number }>) {
      const { x, y } = action.payload;
      state.mousePosition = { x, y };
    },

    setSelectedAction(state, action: PayloadAction<ActionInfo | undefined>) {
      // If no unit is selected, actions can't be clicked
      if (state.selectedUnit != null) {
        state.selectedAction = action.payload;
      }
    },
    clearSelectedAction(state) {
      state.selectedAction = undefined;
    },
    isPausedChanged(state, action: PayloadAction<boolean>) {
      state.isPaused = action.payload;
    },
  },
  extraReducers: {
    [keyPressed.toString()]: (state, action) => {
      switch (action.payload) {
        case Keycodes.Esc: {
          if (state.selectedAction) {
            state.selectedAction = undefined;
          } else if (state.selectedUnit) {
            state.selectedUnit = null;
          }
          break;
        }
        default:
      }
    },
  },
});

const { isPausedChanged, updateMousePosition } = combatSceneSlice.actions;

export const { clearSelectedAction, clickedOnUnit, updatedUnitCoords } = combatSceneSlice.actions;

export default combatSceneSlice.reducer;

export const setSkillTarget = (unit: number, targets: number[], action: ActionInfo): void => {
  setSkillTargetApi(unit, targets, action.name);
};

const updateMousePositionInner = throttle((dispatch: Dispatch, newPos: MousePos) => {
  dispatch(updateMousePosition(newPos));
}, 100);

// eslint-disable-next-line max-len
export const setMousePosition = (newPos: MousePos): AppThunk => (dispatch) =>
  updateMousePositionInner(dispatch, newPos);

export const setIsPaused = (nextState: boolean): AppThunk => (dispatch) => {
  GameManager.instance.setPaused(nextState);
  dispatch(isPausedChanged(nextState));
};
