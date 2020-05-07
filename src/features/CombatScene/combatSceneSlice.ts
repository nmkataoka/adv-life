import { createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { GameManager } from "../../engine/GameManager";
import { HealthCmpt } from "../../ncomponents/HealthCmpt";
import { FactionCmpt } from "../../ncomponents/FactionCmpt";

const initialState = {
  units: {}
}

const combatSceneSlice = createSlice({
  name: "combatScene",
  initialState,
  reducers: {
    updatedUnits(state, action) {
      state.units = action.payload.units;
    }
  }
})

const { updatedUnits } = combatSceneSlice.actions;

export default combatSceneSlice.reducer;

export const updateUnitsFromEngine = (dispatch: Dispatch) => {
  const eMgr = GameManager.instance.eMgr;
  const healthMgr = eMgr.GetComponentManager<HealthCmpt, typeof HealthCmpt>(HealthCmpt);
  const factionMgr = eMgr.GetComponentManager<FactionCmpt, typeof FactionCmpt>(FactionCmpt);

  const units: {[key: string]: {entityHandle: number; health: number; isEnemy?: boolean}} = {};
  Object.entries(healthMgr.components).forEach(([entity, healthCmpt]) => {
    const entityHandle = parseInt(entity, 10);
    const health = healthCmpt.health;
    const factionCmpt = factionMgr.GetByNumber(entityHandle);
    units[entityHandle] = ({ entityHandle, health, isEnemy: factionCmpt?.isEnemy });
  });

  dispatch(updatedUnits({ units }));
}

