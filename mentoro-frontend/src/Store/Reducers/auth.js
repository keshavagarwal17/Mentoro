import { createSlice } from '@reduxjs/toolkit';
import { getUserId,removeUserId,saveUserId } from '../../Shared/local';

export const auth = createSlice({
  name: 'auth',
  initialState: {
    userId: getUserId()
  },
  reducers: {
    logIn: (state,action) => {
      state.userId = action.payload;
      saveUserId(action.payload)
    },
    logOut: (state) => {
      state.userId = null;
      removeUserId();
    },
  },
})

// Action creators are generated for each case reducer function
export const { logIn, logOut } = auth.actions

export default auth.reducer