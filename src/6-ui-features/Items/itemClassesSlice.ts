import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getItemClasses } from '3-frontend-api/Items/getItemClasses';
import { ItemClassInfo } from '3-frontend-api/Items/ItemClassInfo';
import { DictOf } from '4-helpers/DictOf';
import { AppThunk } from '../../7-app/types';

const initialState = {
  byId: {} as DictOf<ItemClassInfo>,
};

const itemClassesSlice = createSlice({
  name: 'itemClasses',
  initialState,
  reducers: {
    updateItemClasses(state, action: PayloadAction<ItemClassInfo[]>) {
      const itemClasses = action.payload;
      itemClasses.forEach((itemClass, index) => {
        state.byId[index] = itemClass;
      });
    },
  },
});

const { updateItemClasses } = itemClassesSlice.actions;

export default itemClassesSlice.reducer;

export const updateItemClassesFromEngine = (): AppThunk => (dispatch) => {
  const itemClasses = getItemClasses();
  dispatch(updateItemClasses(itemClasses));
};
