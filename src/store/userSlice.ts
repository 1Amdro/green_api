import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserStateI {
  idInstance: string;
  apiTokenInstance: string;
  authStatus: "" | "authorized" | "unauthorized";
}

const initialState: UserStateI = {
  idInstance: "",
  apiTokenInstance: "",
  authStatus: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIdInstance: (state, action: PayloadAction<string>) => {
      state.idInstance = action.payload;
    },
    setApiTokenInstance: (state, action: PayloadAction<string>) => {
      state.apiTokenInstance = action.payload;
    },
    setAuthStatus: (state, action: PayloadAction<UserStateI["authStatus"]>) => {
      state.authStatus = action.payload;
    },
  },
});

export const { setAuthStatus, setIdInstance, setApiTokenInstance } =
  userSlice.actions;
export default userSlice.reducer;
