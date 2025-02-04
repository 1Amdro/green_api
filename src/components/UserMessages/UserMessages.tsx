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
  let notificationId: string | number | null = null;

  const randomNum = Math.floor(Math.random() * 1000);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMsg = async () => {
    if (user.trim() === "") return;

    dispatch(
      userSendMessage({
        idInstance,
        apiTokenInstance,
        chatId,
        message,
      })
    );

    setMessage("");
    setMessages((prev) => [
      ...prev,
      {
        id: idInstance + randomNum,
        message: message,
        type: "your",
      },
    ]);

    setInterval(() => {
      receiveNotification();
    }, 5000);
  };

  const deleteNotification = async () => {
    if (!notificationId) return;

    dispatch(
      userDeleteNotification({
        idInstance,
        apiTokenInstance,
        notificationId,
      })
    );
  };

  const receiveNotification = async () => {
    const data = await dispatch(
      userReceiveNotification({
        idInstance,
        apiTokenInstance,
      })
    ).unwrap();
    notificationId = data?.receiptId;

    await deleteNotification();

    const msg = data?.body?.messageData?.textMessageData?.textMessage;
    if (!msg) return;
    const check = messages.find((item) => item.message === msg);
    if (check) return;
    setMessages((prev) => [
      ...prev,
      {
        id: idInstance + randomNum,
        message: msg,
        type: "other",
      },
    ]);
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
            <button onClick={receiveNotification}>Получить</button>
          </footer>
        </>
      ) : (
        <h1 className={styles.title_warning}>Выберите пользователя</h1>
      )}
    </section>
  );
}
