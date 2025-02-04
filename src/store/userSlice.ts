import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import getGreenApi from "../api/green_api";

export const fetchAuthStatus = createAsyncThunk(
  "user/fetchAuthStatus",
  async function (
    params: { idInstance: string; apiTokenInstance: string },
    { rejectWithValue }
  ) {
    try {
      const response = await fetch(
        getGreenApi(
          "getStateInstance",
          params?.idInstance,
          params?.apiTokenInstance
        )
      );

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const userSendMessage = createAsyncThunk(
  "user/userSendMessage",
  async function (
    params: {
      idInstance: string;
      apiTokenInstance: string;
      chatId: string;
      message: string;
    },
    { rejectWithValue }
  ) {
    try {
      const response = await fetch(
        getGreenApi(
          "sendMessage",
          params?.idInstance,
          params?.apiTokenInstance
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: params.chatId,
            message: params.message,
          }),
        }
      );

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const userDeleteNotification = createAsyncThunk(
  "user/userDeleteNotification",
  async function (
    params: {
      idInstance: string;
      apiTokenInstance: string;
      notificationId: string | number;
    },
    { rejectWithValue }
  ) {
    try {
      const response = await fetch(
        getGreenApi(
          "deleteNotification",
          params?.idInstance,
          params?.apiTokenInstance
        ) +
          "/" +
          params?.notificationId,
        {
          method: "DELETE",
          redirect: "follow",
        }
      );

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const userReceiveNotification = createAsyncThunk(
  "user/userReceiveNotification",
  async function (
    params: { idInstance: string; apiTokenInstance: string },
    { rejectWithValue }
  ) {
    try {
      const response = await fetch(
        getGreenApi(
          "receiveNotification",
          params?.idInstance,
          params?.apiTokenInstance
        ),
        {
          method: "GET",
          redirect: "follow",
        }
      );

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

interface UserStateI {
  idInstance: string;
  apiTokenInstance: string;
  authStatus: "" | "authorized" | "unauthorized";
  status: string;
}

const initialState: UserStateI = {
  idInstance: "",
  apiTokenInstance: "",
  authStatus: "",
  status: "",
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
  extraReducers(builder) {
    builder.addCase(fetchAuthStatus.fulfilled, (state, action) => {
      state.authStatus = action.payload.stateInstance;
    });
    builder.addCase(fetchAuthStatus.rejected, (state) => {
      state.authStatus = "unauthorized";
    });
    builder.addCase(fetchAuthStatus.pending, (state) => {
      state.authStatus = "";
    });

    builder.addCase(userSendMessage.fulfilled, (state) => {
      state.status = "fulfilled";
    });
    builder.addCase(userSendMessage.rejected, (state, action) => {
      state.status = "rejected" + action.payload;
    });
    builder.addCase(userSendMessage.pending, (state) => {
      state.status = "pending";
    });

    builder.addCase(userDeleteNotification.fulfilled, (state) => {
      state.status = "fulfilled";
    });
    builder.addCase(userDeleteNotification.rejected, (state, action) => {
      state.status = "rejected" + action.payload;
    });
    builder.addCase(userDeleteNotification.pending, (state) => {
      state.status = "pending";
    });

    builder.addCase(userReceiveNotification.fulfilled, (state) => {
      state.status = "fulfilled";
    });
    builder.addCase(userReceiveNotification.rejected, (state, action) => {
      state.status = "rejected" + action.payload;
    });
    builder.addCase(userReceiveNotification.pending, (state) => {
      state.status = "pending";
    });
  },
});

export const { setAuthStatus, setIdInstance, setApiTokenInstance } =
  userSlice.actions;
export default userSlice.reducer;
