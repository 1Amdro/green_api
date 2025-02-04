import styles from "./AuthPage.module.css";
import { SyntheticEvent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { setIdInstance, setApiTokenInstance } from "../../store/userSlice";
import { getAuthStatus } from "../../store/userActions";

function AuthPage() {
  const idRef = useRef<HTMLInputElement>(null);
  const apiTokenRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const authStatus = useSelector((state: RootState) => state.user.authStatus);
  const handleAuthForm = async (e: SyntheticEvent) => {
    e.preventDefault();

    await checkAuth();
  };

  const checkAuth = async () => {
    const idInstance = idRef.current?.value;
    const apiTokenInstance = apiTokenRef.current?.value;

    if (!idInstance || !apiTokenInstance) {
      return;
    }

    dispatch(setIdInstance(idInstance));
    dispatch(setApiTokenInstance(apiTokenInstance));
    dispatch(getAuthStatus(idInstance, apiTokenInstance));
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
        <input
          ref={idRef}
          type="text"
          id="idInstance"
          autoComplete="username"
          required
        />

        <label htmlFor="apiTokenInstance">apiTokenInstance</label>
        <input
          ref={apiTokenRef}
          type="password"
          id="apiTokenInstance"
          autoComplete="current-password"
          required
        />

        <button>Войти</button>
      </div>
    </form>
  );
}

export default AuthPage;
