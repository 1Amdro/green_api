import styles from "./UserMessages.module.css";
import userIcon from "../../assets/user_icon.svg";
import getGreenApi from "../../api/green_api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";

export default function UserMessages({ user }: { user: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { id: string; message: string; type: string }[]
  >([]);

  const idInstance = useSelector((state: RootState) => state.user.idInstance);
  const apiTokenInstance = useSelector(
    (state: RootState) => state.user.apiTokenInstance
  );

  const chatId = user.trim() + "@c.us";
  let notificationId: string | null = null;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMsg = async () => {
    if (user.trim() === "") return;
    console.log(user);
    try {
      const request = await fetch(
        getGreenApi("sendMessage", idInstance, apiTokenInstance),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId,
            message,
          }),
        }
      );

      const response = await request.json();
      setMessage("");
      setMessages((prev) => [
        ...prev,
        { id: response.idMessage, message, type: "your" },
      ]);
      console.log(response);
      receiveNotification();
    } catch (error) {
      console.error(
        `Something went wrong when sending message: ${(error as Error).message}`
      );
    }
  };

  const deleteNotification = async () => {
    try {
      const request = await fetch(
        getGreenApi("deleteNotification", idInstance, apiTokenInstance) +
          "/" +
          notificationId,
        {
          method: "DELETE",
          redirect: "follow",
        }
      );
      const response = await request.json();
      console.log(response);
    } catch (error) {
      console.error(
        `Something went wrong when deleting notification: ${
          (error as Error).message
        }`
      );
    }
  };

  const receiveNotification = async () => {
    try {
      const request = await fetch(
        getGreenApi("receiveNotification", idInstance, apiTokenInstance) +
          "?receiveTimeout=5",
        {
          method: "GET",
          redirect: "follow",
        }
      );
      const response = await request.json();
      notificationId = response.receiptId;
      console.log(response);
      deleteNotification();
      // setMessages((prev) => [...prev, { id: response.idMessage, ...response }]);
    } catch (error) {
      console.error(
        `Something went wrong when getting notification: ${
          (error as Error).message
        }`
      );
    }
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
