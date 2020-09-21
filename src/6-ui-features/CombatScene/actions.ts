import { createAction } from '@reduxjs/toolkit';
import { getUnitInfos, UnitInfo } from '3-frontend-api/UnitInfo';
import { DictOf } from '4-helpers/DictOf';
import { AppThunk } from '7-app/types';

export const updatedUnits = createAction<{ units: DictOf<UnitInfo> }, 'combatScene/updatedUnits'>(
  'combatScene/updatedUnits',
);

export const updateUnitsFromEngine = (): AppThunk => (dispatch) => {
  const units = getUnitInfos();

  dispatch(updatedUnits({ units }));
};
