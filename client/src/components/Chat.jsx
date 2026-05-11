import { useEffect, useState } from "react";

import io from "socket.io-client";

import CryptoJS from "crypto-js";

const socket = io("http://localhost:5000");

const SECRET_KEY = "securechatkey";

function Chat() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [onlineUsers,
    setOnlineUsers] =
    useState(0);

  const [chatStarted,
    setChatStarted] =
    useState(false);

  function joinChat() {

    if (

      username.trim() === "" ||

      password.trim() === ""

    ) {

      alert(
        "Enter username and password"
      );

      return;
    }

    if (
      password !== "secure123"
    ) {

      alert(
        "Wrong password"
      );

      return;
    }

    setChatStarted(true);
  }

  function sendMessage() {

    if (
      message.trim() === ""
    ) return;

    const encryptedMessage =

      CryptoJS.AES.encrypt(
        message,
        SECRET_KEY
      ).toString();

    const messageData = {

      username,

      text: encryptedMessage,

      type: "sent",

      time:
        new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),

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

  if (!chatStarted) {

    return (

      <div className="join-page">

        <div className="join-card">

          <h1>
            Secure Login
          </h1>

          <p>
            Access encrypted messaging
          </p>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button
            onClick={joinChat}
          >

            Join Secure Chat

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

            {onlineUsers}
            {" "}
            Users Online

          </p>

        </div>

        <div className="messages-area">

          {

            messages.map(
              (msg, index) => (

              <div
                key={index}
                className={`message-bubble ${msg.type}`}
              >

                <strong className="message-user">

                  {msg.username}

                </strong>

                <p className="message-text">

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

                <div className="message-footer">

                  <span className="message-time">

                    {msg.time}

                  </span>

                  {

                    msg.type === "sent" && (

                      <span className="message-status">

                        ✓✓

                      </span>

                    )

                  }

                </div>

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
              setMessage(
                e.target.value
              )
            }
          />

          <button
            onClick={sendMessage}
          >

            Send

          </button>

        </div>

      </div>

    </div>

  );
}

export default Chat;