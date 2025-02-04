import styles from "./UserMessages.module.css";
import userIcon from "../../assets/user_icon.svg";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useEffect, useState } from "react";
import {
  userDeleteNotification,
  userReceiveNotification,
  userSendMessage,
} from "../../store/userSlice";

export default function UserMessages({ user }: { user: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { id: string; message: string; type: string }[]
  >([]);

  const dispatch: AppDispatch = useDispatch();

  const idInstance = useSelector((state: RootState) => state.user.idInstance);
  const apiTokenInstance = useSelector(
    (state: RootState) => state.user.apiTokenInstance
  );

  const chatId = user.trim() + "@c.us";
  const notificationId: string | null = null;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMsg = async () => {
    if (user.trim() === "") return;
    const randomNum = Math.floor(Math.random() * 1000);

    const res = dispatch(
      userSendMessage({
        idInstance,
        apiTokenInstance,
        chatId,
        message,
      })
    );
    console.log(res.arg);
    setMessage("");
    setMessages((prev) => [
      ...prev,
      {
        id: res?.arg.idInstance + randomNum,
        message: res.arg.message,
        type: "your",
      },
    ]);

    receiveNotification();
  };

  const deleteNotification = async () => {
    if (!notificationId) return;
    const res = await dispatch(
      userDeleteNotification({
        idInstance,
        apiTokenInstance,
        notificationId,
      })
    ).unwrap();

    console.log(res);
  };

  const receiveNotification = async () => {
    const data = await dispatch(
      userReceiveNotification({
        idInstance,
        apiTokenInstance,
      })
    ).unwrap();
    console.log(data);
    deleteNotification();
  };

  useEffect(() => {
    setMessages([]);
  }, [user]);

  return (
    <section className={`${styles.container} ${!user && styles.inactive} }`}>
      {user ? (
        <>
          <header className={styles.header}>
            <img width={40} src={userIcon} alt="user" />
            <h1 className={styles.title}>{"+" + user}</h1>
          </header>
          <section>
            <ul className={styles.messages_list}>
              {messages.map(({ id, message, type }) => (
                <li
                  key={id}
                  className={`${styles.message} ${
                    type === "your" && styles.active
                  }`}
                >
                  {message}
                </li>
              ))}
            </ul>
          </section>
          <footer className={styles.footer}>
            <input
              className={styles.input}
              typeof="text"
              placeholder="Введите сообщение"
              value={message}
              onChange={handleInput}
              onKeyDown={(e) => e.key === "Enter" && handleSendMsg()}
            />
            <button onClick={handleSendMsg} className={styles.btn_send}>
              Отправить
            </button>
          </footer>
        </>
      ) : (
        <h1 className={styles.title_warning}>Выберите пользователя</h1>
      )}
    </section>
  );
}
