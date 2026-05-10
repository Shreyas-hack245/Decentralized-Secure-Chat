function Chat() {

  return (

    <div className="chat-container">

      <div className="chat-box">

        <div className="message received">
          Hello 👋
        </div>

        <div className="message sent">
          Hi 🚀
        </div>

      </div>

      <div className="input-area">

        <input
          type="text"
          placeholder="Type message..."
        />

        <button>
          Send
        </button>

      </div>

    </div>

  );
}

export default Chat;