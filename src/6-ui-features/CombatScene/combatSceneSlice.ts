import { createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { GameManager } from "../../0-engine/GameManager";
import { HealthCmpt } from "../../1- ncomponents/HealthCmpt";
import { FactionCmpt } from "../../1- ncomponents/FactionCmpt";

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
};

const combatSceneSlice = createSlice({
  name: "combatScene",
  initialState,
  reducers: {
    updatedUnits(state, action) {
      state.units = action.payload.units;
    },
  },
});

const { updatedUnits } = combatSceneSlice.actions;

export default combatSceneSlice.reducer;

export const updateUnitsFromEngine = (dispatch: Dispatch) => {
  const { eMgr } = GameManager.instance;
  const healthMgr = eMgr.GetComponentManager<HealthCmpt, typeof HealthCmpt>(
    HealthCmpt
  );
  const factionMgr = eMgr.GetComponentManager<FactionCmpt, typeof FactionCmpt>(
    FactionCmpt
  );

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
