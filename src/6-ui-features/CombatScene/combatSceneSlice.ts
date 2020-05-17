import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import throttle from 'lodash.throttle';
import { GameManager } from '../../0-engine/GameManager';
import { HealthCmpt } from '../../1- ncomponents/HealthCmpt';
import { FactionCmpt } from '../../1- ncomponents/FactionCmpt';
import { ActionInfo, CreateActionInfo } from './ActionInfo';
import { CombatPositionCmpt } from '../../1- ncomponents/CombatPositionCmpt';
import { CombatStatsCmpt } from '../../1- ncomponents/CombatStatsCmpt';
import { keyPressed } from '../common/actions';
import { Keycodes } from '../common/constants';
import { AppThunk } from '../../7-app/types';
import { SetSkillTarget } from '../../3-api';
import { StatusEffectsCmpt } from '../../1- ncomponents/StatusEffectsCmpt';

export type UnitInfo = {
  entityHandle: number;
  health: number;
  maxHealth: number;

  mana: number;
  maxMana: number;

  isChanneling: boolean;
  channelRemaining: number;
  channelTotalDuration: number;

  isRecovering: boolean;
  recoveryRemaining: number;
  recoveryTotalDuration: number;

  isStealthed: boolean;

  isEnemy?: boolean;
  position: number;
};

type Units = {
  [key: string]: UnitInfo;
};

type MousePos = {
  x: number;
  y: number;
};

const initialState = {
  units: {} as Units,

  selectedUnit: null as null | number,

  // Relative to the position: relative container
  mousePosition: { x: 0, y: 0 } as MousePos,

  actions: [
    CreateActionInfo({ name: 'attack', displayText: 'Attack' }),
    CreateActionInfo({ name: 'defend', displayText: 'Defend' }),
    CreateActionInfo({ name: 'fireball', displayText: 'Fireball', aoeRadius: 1 }),
    CreateActionInfo({ name: 'stealth', displayText: 'Stealth' }),
    CreateActionInfo({ name: 'potion', displayText: 'Potion' }),
    CreateActionInfo({ name: 'flee', displayText: 'Flee' }),
  ],
  selectedAction: undefined as ActionInfo | undefined,

  isPaused: false,
};

const combatSceneSlice = createSlice({
  name: 'combatScene',
  initialState,
  reducers: {
    updatedUnits(state, action: PayloadAction<{ units: Units }>) {
      state.units = action.payload.units;
    },
    clickedOnUnit(state, action: PayloadAction<number>) {
      const handle = action.payload;
      if (state.selectedUnit === handle) {
        // You deselect a unit by clicking on it again
        state.selectedUnit = null;
        state.selectedAction = undefined;
      } else {
        const selectedIsOwnedUnit = !state.units[handle].isEnemy;
        if (state.selectedUnit && !selectedIsOwnedUnit) {
          // If you select your own unit and then an enemy,
          // the attack target should be set outside of redux and the selected resets
          state.selectedUnit = null;
          state.selectedAction = undefined;
        } else if (selectedIsOwnedUnit) {
          // Select your own unit
          state.selectedUnit = handle;
        }
      }
    },
    updateMousePosition(state, action: PayloadAction<{ x: number; y: number }>) {
      const { x, y } = action.payload;
      state.mousePosition = { x, y };
    },

    selectedAction(state, action: PayloadAction<ActionInfo | undefined>) {
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

const { isPausedChanged, updatedUnits, updateMousePosition } = combatSceneSlice.actions;

export const { clickedOnUnit, selectedAction, clearSelectedAction } = combatSceneSlice.actions;

export default combatSceneSlice.reducer;

export const updateUnitsFromEngine = (): AppThunk => (dispatch) => {
  const { eMgr } = GameManager.instance;
  const combatStatsMgr = eMgr.GetComponentManager(CombatStatsCmpt);
  const healthMgr = eMgr.GetComponentManager(HealthCmpt);
  const factionMgr = eMgr.GetComponentManager(FactionCmpt);
  const positionMgr = eMgr.GetComponentManager(CombatPositionCmpt);
  const statusEffectsMgr = eMgr.GetComponentManager(StatusEffectsCmpt);

  const units: Units = {};
  Object.entries(healthMgr.components).forEach(([entity, healthCmpt]) => {
    const entityHandle = parseInt(entity, 10);

    const { health, maxHealth } = healthCmpt;

    const combatStatsCmpt = combatStatsMgr.GetByNumber(entityHandle);
    const factionCmpt = factionMgr.GetByNumber(entityHandle);
    const statusEffectsCmpt = statusEffectsMgr.GetByNumber(entityHandle);
    if (!statusEffectsCmpt) throw new Error('unit is missing StatusEffectsCmpt');
    const channel = statusEffectsCmpt.GetStatusEffect('Channel');
    const recovering = statusEffectsCmpt.GetStatusEffect('Recover');

    const combatPos = positionMgr.GetByNumber(entityHandle);
    if (!combatPos) throw new Error('unit is missing CombatPositionCmpt');


    units[entityHandle] = {
      entityHandle,
      health,
      maxHealth,

      mana: combatStatsCmpt?.mana ?? 100,
      maxMana: combatStatsCmpt?.maxMana ?? 100,

      isChanneling: channel.severity > 0,
      channelRemaining: channel.remainingDuration,
      channelTotalDuration: channel.totalDuration,

      isRecovering: recovering.severity > 0,
      recoveryRemaining: recovering.remainingDuration,
      recoveryTotalDuration: recovering.totalDuration,

      isStealthed: statusEffectsCmpt.IsStatusEffectActive('Stealth'),

      isEnemy: factionCmpt?.isEnemy,
      position: combatPos.position,

    };
  });

  dispatch(updatedUnits({ units }));
};

export const setSkillTarget = (unit: number, target: number, action: ActionInfo) => {
  SetSkillTarget(unit, [target], action.name);
};

const updateMousePositionInner = throttle((dispatch: Dispatch, newPos: MousePos) => {
  dispatch(updateMousePosition(newPos));
}, 100);

// eslint-disable-next-line max-len
export const setMousePosition = (newPos: MousePos): AppThunk => (dispatch) => updateMousePositionInner(dispatch, newPos);

export const setIsPaused = (nextState: boolean): AppThunk => (dispatch) => {
  GameManager.instance.SetPaused(nextState);
  dispatch(isPausedChanged(nextState));
};
