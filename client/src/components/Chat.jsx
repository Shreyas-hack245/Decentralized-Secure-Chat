import { useEffect, useState } from "react";

import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  function sendMessage() {

    if (message.trim() === "") return;

    const messageData = {
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

  return (

    <div className="chat-container">

      <div className="chat-box">

        {
          messages.map((msg, index) => (

            <div
              key={index}
              className={`message ${msg.type}`}
            >

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