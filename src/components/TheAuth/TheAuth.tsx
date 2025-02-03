import { SyntheticEvent, useEffect } from "react";
import styles from "./TheAuth.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  setApiTokenInstance,
  setAuthStatus,
  setIdInstance,
} from "../../store/userSlice";
import getGreenApi from "../../api/green_api";

function TheAuth() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const authStatus = useSelector((state: RootState) => state.user.authStatus);
  const handleAuthForm = async (e: SyntheticEvent) => {
    e.preventDefault();

    await checkAuth();
  };

  const checkAuth = async () => {
    try {
      const idInstance = (
        document.getElementById("idInstance") as HTMLInputElement
      ).value;
      const apiTokenInstance = (
        document.getElementById("apiTokenInstance") as HTMLInputElement
      ).value;

      dispatch(setIdInstance(idInstance));
      dispatch(setApiTokenInstance(apiTokenInstance));

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

  useEffect(() => {
    if (authStatus === "authorized") {
      navigate("/chat");
    }
  }, [authStatus]);
  return (
    <form className={styles.form} onSubmit={handleAuthForm}>
      <h2 className={styles.title}>GREEN-API</h2>

      <div className={styles.container}>
        <h3 className={styles.subtitle}>Вход</h3>

        <label htmlFor="idInstance">idInstance</label>
        <input type="text" id="idInstance" required />

        <label htmlFor="apiTokenInstance">apiTokenInstance</label>
        <input type="password" id="apiTokenInstance" required />

        <button>Войти</button>
      </div>
    </form>
  );
}

export default TheAuth;
