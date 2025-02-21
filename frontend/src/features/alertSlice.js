import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "alert",
  initialState: [],
  reducers: {
    showAlert: (state, action) => {
      state.push(action.payload);
    },
    removeAlert: (state, action) => {
      return state.filter(alert => alert.id !== action.payload);
    }
  }
});

export const { showAlert, removeAlert } = alertSlice.actions;
export default alertSlice.reducer;
