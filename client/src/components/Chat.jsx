import { useEffect, useState } from "react";

import io from "socket.io-client";

import CryptoJS from "crypto-js";

const socket = io("http://localhost:5000");

const SECRET_KEY = "securechatkey";

function Chat() {

  const [username, setUsername] = useState("");

  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [onlineUsers, setOnlineUsers] =
    useState(0);

  function joinChat() {

    if (username.trim() === "") return;

    setJoined(true);
  }

  function sendMessage() {

    if (message.trim() === "") return;

    const encryptedMessage =
      CryptoJS.AES.encrypt(
        message,
        SECRET_KEY
      ).toString();

    console.log(
      "Encrypted:",
      encryptedMessage
    );

    const messageData = {

      username,

      text: encryptedMessage,

      type: "sent",
    };

    setMessages((prev) => [
      ...prev,
      messageData,
    ]);

    socket.emit(
      "send_message",
      messageData
    );

    setMessage("");

  }

  useEffect(() => {

    socket.on(
      "receive_message",
      (data) => {

        setMessages((prev) => [
          ...prev,
          {
            ...data,
            type: "received",
          },
        ]);

      }
    );

    socket.on(
      "online_users",
      (count) => {

        setOnlineUsers(count);

      }
    );

  }, []);

  if (!joined) {

    return (

      <div className="join-page">

        <div className="join-card">

          <h1>
            Secure Global Chat
          </h1>

          <p>
            End-to-End Encrypted Messaging
          </p>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <button onClick={joinChat}>
            Join Chat
          </button>

        </div>

      </div>

    );
  }

  return (

    <div className="chat-wrapper">

      <div className="sidebar">

        <div className="profile">

          <div className="avatar">

            {username[0]}

          </div>

          <div>

            <h3>
              {username}
            </h3>

            <p>
              Online
            </p>

          </div>

        </div>

        <div className="privacy-card">

          <h3>
            🔐 Secure Messaging
          </h3>

          <p>
            AES-256 encryption enabled
            for all messages.
          </p>

        </div>

      </div>

      <div className="chat-section">

        <div className="security-banner">

          🔐 AES-256 End-to-End Encryption Active

        </div>

        <div className="chat-header">

          <h2>
            Secure Global Chat
          </h2>

          <p>

            {onlineUsers} Users Online

          </p>

        </div>

        <div className="messages-area">

          {
            messages.map((msg, index) => (

              <div
                key={index}
                className={`message-bubble ${msg.type}`}
              >

                <strong>
                  {msg.username}
                </strong>

                <p>

                  {
                    CryptoJS.AES.decrypt(
                      msg.text,
                      SECRET_KEY
                    )
                    .toString(
                      CryptoJS.enc.Utf8
                    )
                  }

                </p>

              </div>

            ))
          }

        </div>

        <div className="message-input-area">

          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

    </div>

  );
}

export default Chat;