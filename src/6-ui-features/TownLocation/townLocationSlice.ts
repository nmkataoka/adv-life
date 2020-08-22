import { createSlice } from '@reduxjs/toolkit';
import { TownLocationsDict } from '../../3-api/town';

const initialState = {
  byId: {} as TownLocationsDict,
};

const townLocationSlice = createSlice({
  name: 'townLocation',
  initialState,
  reducers: {

  },
});

export default townLocationSlice.reducer;
