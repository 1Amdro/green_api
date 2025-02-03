import { useEffect, useState } from "react";
import UserMessages from "../UserMessages/UserMessages";
import styles from "./TheChat.module.css";
import newChatIcon from "../../assets/chat_new.svg";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";

function TheChat() {
  const [newChat, setNewChat] = useState(false);
  const [isRemoved, setIsRemoved] = useState(true);
  const [userToChat, setUserToChat] = useState("");

  const navigate = useNavigate();

  const authStatus = useSelector((state: RootState) => state.user.authStatus);

  const handleNewChat = () => {
    setNewChat(!newChat);
    setIsRemoved(false);
  };

  const handleRemoveChat = () => {
    setIsRemoved(true);
    setTimeout(() => setNewChat(false), 300);
  };

  const handleEnterChat = () => {
    const num = (document.getElementById("number") as HTMLInputElement).value;
    if (!num || num.length < 8) return;
    setUserToChat(num);
    handleRemoveChat();
  };

  useEffect(() => {
    if (authStatus !== "authorized") {
      navigate("/");
    }
  }, [authStatus]);

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        <div className={styles.chats}>
          <h2 className={styles.title}>Чат</h2>
          <button onClick={handleNewChat} className={styles.btn_enter}>
            <img width={25} src={newChatIcon} alt="create new chat" />
          </button>
        </div>
        {newChat && (
          <div className={`${styles.new_chat} ${isRemoved && styles.active}`}>
            <div className={styles.new_chat__wrap}>
              <h2 className={styles.new_chat__title}>Новый чат</h2>
              <button
                className={styles.new_chat__close}
                onClick={handleRemoveChat}
              >
                <img width={40} src={arrowLeftIcon} alt="close" />
              </button>
            </div>

            <label htmlFor="number" className={styles["num_field"]}>
              <input id="number" type="number" placeholder="Введите номер" />
            </label>
            <button onClick={handleEnterChat} className={styles.btn_enter_chat}>
              Выбрать
            </button>
          </div>
        )}
        <div className={styles.user}>{userToChat}</div>
      </div>
      <UserMessages user={userToChat} />
    </div>
  );
}

export default TheChat;
