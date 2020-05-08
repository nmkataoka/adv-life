import { createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { GameManager } from "../../0-engine/GameManager";
import { HealthCmpt } from "../../1- ncomponents/HealthCmpt";
import { FactionCmpt } from "../../1- ncomponents/FactionCmpt";
import { CanAttackCmpt } from "../../1- ncomponents/CanAttackCmpt";

type Units = {
  [key: string]: {
    entityHandle: number;
    health: number;
    maxHealth: number;
    isEnemy?: boolean;
  };
};

const initialState = {
  units: {} as Units,

  selectedUnit: null as null | number,
};

const combatSceneSlice = createSlice({
  name: "combatScene",
  initialState,
  reducers: {
    updatedUnits(state, action) {
      state.units = action.payload.units;
    },
    clickedOnUnit(state, action) {
      const handle = action.payload;
      if (state.selectedUnit === handle) {
        // You deselect a unit by clicking on it again
        state.selectedUnit = null;
      } else {
        const selectedIsOwnedUnit = !state.units[handle].isEnemy;
        if (state.selectedUnit && !selectedIsOwnedUnit) {
          // If you select your own unit and then an enemy,
          // the attack target should be set outside of redux and the selected resets
          state.selectedUnit = null;
        } else if (selectedIsOwnedUnit) {
          // Select your own unit
          state.selectedUnit = handle;
        }
      }
    },
  },
});

const { updatedUnits } = combatSceneSlice.actions;

export const { clickedOnUnit } = combatSceneSlice.actions;

export default combatSceneSlice.reducer;

export const updateUnitsFromEngine = () => (dispatch: Dispatch) => {
  const { eMgr } = GameManager.instance;
  const healthMgr = eMgr.GetComponentManager<HealthCmpt, typeof HealthCmpt>(HealthCmpt);
  const factionMgr = eMgr.GetComponentManager<FactionCmpt, typeof FactionCmpt>(FactionCmpt);

  const units: Units = {};
  Object.entries(healthMgr.components).forEach(([entity, healthCmpt]) => {
    const entityHandle = parseInt(entity, 10);
    const { health, maxHealth } = healthCmpt;
    const factionCmpt = factionMgr.GetByNumber(entityHandle);
    units[entityHandle] = {
      entityHandle,
      health,
      maxHealth,
      isEnemy: factionCmpt?.isEnemy,
    };
  });

  dispatch(updatedUnits({ units }));
};

export const setUnitAttackTarget = (unit: number, target: number) => {
  const { eMgr } = GameManager.instance;
  const canAttackMgr = eMgr.GetComponentManager<CanAttackCmpt, typeof CanAttackCmpt>(CanAttackCmpt);
  const attacker = canAttackMgr.GetByNumber(unit);
  console.log("set unit attack target", unit, target);
  if (attacker) {
    attacker.targetEntity = target;
  }
};
