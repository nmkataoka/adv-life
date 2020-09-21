import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byId: {},
};

const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {},
});

export default materialsSlice.reducer;
