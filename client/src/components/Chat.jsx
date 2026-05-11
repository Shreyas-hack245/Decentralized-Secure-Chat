import { useEffect, useState } from "react";

import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {

  const [username, setUsername] = useState("");

  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  function joinChat() {

    if (username.trim() === "") return;

    setJoined(true);
  }

  function sendMessage() {

    if (message.trim() === "") return;

    const messageData = {
      username,
      text: message,
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

  }, []);

  if (!joined) {

    return (

      <div className="join-container">

        <h2>Join Secure Chat</h2>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <button onClick={joinChat}>
          Join
        </button>

      </div>

    );
  }

  return (

    <div className="chat-container">

      <div className="chat-box">

        {
          messages.map((msg, index) => (

            <div
              key={index}
              className={`message ${msg.type}`}
            >

              <strong>
                {msg.username}
              </strong>

              <br />

              {msg.text}

            </div>

          ))
        }

      </div>

      <div className="input-area">

        <input
          type="text"
          placeholder="Type message..."
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

  );
}

export default Chat;