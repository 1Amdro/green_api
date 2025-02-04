import { AppDispatch } from ".";
import getGreenApi from "../api/green_api";
import { setAuthStatus } from "./userSlice";

export const getAuthStatus =
  (idInstance: string, apiTokenInstance: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const request = await fetch(
        getGreenApi("getStateInstance", idInstance, apiTokenInstance)
      );

      const response = await request.json();
      dispatch(setAuthStatus(response.stateInstance));
    } catch (error) {
      console.error(
        `Something went wrong when checking auth: ${(error as Error).message}`
      );
    }
  };
