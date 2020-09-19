import { createAction } from '@reduxjs/toolkit';
import { getUnitInfos, UnitsDict } from '../../3-frontend-api/UnitInfo';
import { AppThunk } from '../../7-app/types';

export const updatedUnits = createAction<
  {units: UnitsDict},
  'combatScene/updatedUnits'
>('combatScene/updatedUnits');

export const updateUnitsFromEngine = (): AppThunk => (dispatch) => {
  const units = getUnitInfos();

  dispatch(updatedUnits({ units }));
};
