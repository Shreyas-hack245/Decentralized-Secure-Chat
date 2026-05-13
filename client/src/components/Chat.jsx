import { useEffect, useState } from "react";

import io from "socket.io-client";

import CryptoJS from "crypto-js";

const socket = io("http://localhost:5000");

const SECRET_KEY = "securechatkey";

function Chat({ disconnectWallet }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState({
    global: [],
    "1": [{ username: "Alice", text: CryptoJS.AES.encrypt("Hey, are we still on?", SECRET_KEY).toString(), type: "received", time: "11:45 AM" }],
    "2": [{ username: "Bob", text: CryptoJS.AES.encrypt("Encryption works!", SECRET_KEY).toString(), type: "received", time: "11:30 AM" }],
    "3": []
  });
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [chatStarted, setChatStarted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  
  const [chats, setChats] = useState([
    { id: "global", name: "Secure Global Chat", lastMsg: "Welcome to the secure chat!", time: "12:00 PM", active: true, unread: 0 },
    { id: "1", name: "Alice (E2EE)", lastMsg: "Hey, are we still on...", time: "11:45 AM", active: false, unread: 2 },
    { id: "2", name: "Bob (E2EE)", lastMsg: "Encryption works!", time: "11:30 AM", active: false, unread: 0 },
    { id: "3", name: "Crypto Group", lastMsg: "Check the update.", time: "Yesterday", active: false, unread: 5 },
  ]);

  const activeChatId = chats.find(c => c.active)?.id || "global";
  const messages = chatMessages[activeChatId] || [];

  function joinChat() {
    if (username.trim() === "" || password.trim() === "") {
      alert("Enter username and password");
      return;
    }
    if (password !== "secure123") {
      alert("Wrong password (hint: secure123)");
      return;
    }
    setChatStarted(true);
  }

  function sendMessage() {
    if (message.trim() === "") return;

    const encryptedMessage = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();

    const messageData = {
      username,
      text: encryptedMessage,
      type: "sent",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), messageData]
    }));

    if (activeChatId === "global") {
      socket.emit("send_message", messageData);
    }
    
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMsg: message, time: messageData.time } : c));
    setMessage("");
    socket.emit("stop_typing", { username, chat: activeChatId });
  }

  function deleteMessage(index) {
    if (confirm("Delete this message?")) {
      const updatedMessages = messages.filter((_, i) => i !== index);
      setChatMessages(prev => ({
        ...prev,
        [activeChatId]: updatedMessages
      }));

      // SYNC SIDEBAR: Update last message in sidebar if deleted message was the last one
      const newLastMsg = updatedMessages.length > 0 
        ? CryptoJS.AES.decrypt(updatedMessages[updatedMessages.length - 1].text, SECRET_KEY).toString(CryptoJS.enc.Utf8)
        : "No messages yet";
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMsg: newLastMsg } : c));
    }
  }

  function clearChat() {
    if (window.confirm("Clear history for this chat?")) {
      setChatMessages(prev => ({ ...prev, [activeChatId]: [] }));
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMsg: "No messages yet" } : c));
    }
  }

  function handleFeatureAlert(name) {
    alert(`${name} is coming soon in Phase 2!`);
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChatMessages((prev) => ({
        ...prev,
        global: [...prev.global, { ...data, type: "received" }]
      }));
      setChats(prev => prev.map(c => c.id === 'global' ? { ...c, lastMsg: CryptoJS.AES.decrypt(data.text, SECRET_KEY).toString(CryptoJS.enc.Utf8), time: data.time } : c));
    });

    socket.on("online_users", (count) => {
      setOnlineUsers(count);
    });

    socket.on("user_typing", (data) => {
      if (data.chat === activeChatId && data.username !== username) {
        setTypingUser(data.username);
        setIsTyping(true);
      }
    });

    socket.on("user_stop_typing", (data) => {
      if (data.chat === activeChatId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("online_users");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, [activeChatId, username]);

  const handleTyping = (val) => {
    setMessage(val);
    if (val.length > 0) {
      socket.emit("typing", { username, chat: activeChatId });
    } else {
      socket.emit("stop_typing", { username, chat: activeChatId });
    }
  }

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!chatStarted) {
    return (
      <div className="join-page">
        <div className="join-card">
          <div className="join-icon">🔐</div>
          <h1>Secure Login</h1>
          <p>Access your encrypted messaging dashboard</p>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="join-btn" onClick={joinChat}>Enter Secure Space</button>
          <button className="back-btn" onClick={disconnectWallet}>Back to Landing</button>
        </div>
      </div>
    );
  }

  const activeChat = chats.find(c => c.active);

  return (
    <div className="chat-wrapper">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="profile-mini">
            <div className="avatar-small">{username[0]?.toUpperCase()}</div>
            <div className="profile-info">
              <span className="profile-name">{username}</span>
              <span className="profile-status">Online</span>
            </div>
          </div>
          <div className="sidebar-actions">
             <button className="icon-btn" onClick={() => setShowSettings(true)} title="Settings">⚙️</button>
             <button className="icon-btn" onClick={disconnectWallet} title="Logout">Logout</button>
          </div>
        </div>

        <div className="search-container">
          <div className="search-bar">
            <span>🔍</span>
            <input 
              type="text" 
              placeholder="Search or start new chat" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-list">
          {filteredChats.map((chat) => (
            <div 
              key={chat.id} 
              className={`chat-item ${chat.active ? 'active' : ''}`}
              onClick={() => {
                setChats(chats.map(c => ({ ...c, active: c.id === chat.id, unread: c.id === chat.id ? 0 : c.unread })));
              }}
            >
              <div className="avatar-small">{chat.name[0]}</div>
              <div className="chat-item-info">
                <div className="chat-item-top">
                  <span className="chat-name">{chat.name}</span>
                  <span className="chat-time">{chat.time}</span>
                </div>
                <div className="chat-item-bottom">
                  <span className="chat-last-msg">{chat.lastMsg}</span>
                  {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-section">
        <div className="chat-main-header">
          <div className="chat-header-left" onClick={() => setShowContactInfo(!showContactInfo)} style={{ cursor: 'pointer' }}>
            <div className="avatar-small">{activeChat?.name[0]}</div>
            <div className="chat-main-info">
              <h3>{activeChat?.name}</h3>
              <p>{isTyping ? `${typingUser} is typing...` : (activeChat?.id === 'global' ? `${onlineUsers} Users Online` : 'Click for contact info')}</p>
            </div>
          </div>
          <div className="chat-header-right">
             <div className="call-actions">
                <button className="icon-btn" title="Video Call" onClick={() => handleFeatureAlert('Video Call')}>📹</button>
                <button className="icon-btn" title="Voice Call" onClick={() => handleFeatureAlert('Voice Call')}>📞</button>
                <div className="divider"></div>
                <button className="icon-btn" title="Clear Chat" onClick={clearChat}>🗑️</button>
                <button className="icon-btn" title="More Options" onClick={() => handleFeatureAlert('More Options')}>⋮</button>
             </div>
          </div>
        </div>

        <div className="messages-area whatsapp-bg">
          <div className="encryption-notice">
             🛡️ Messages are end-to-end encrypted.
          </div>
          {messages.length === 0 && (
            <div className="empty-chat">No messages yet. Say hi! 👋</div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`message-group ${msg.type}`}>
               {msg.type === "received" && (
                <span className="message-user">{msg.username}</span>
              )}
              <div className={`message-bubble ${msg.type}`}>
                <div className="message-header-actions">
                   <span className="msg-dropdown" onClick={() => deleteMessage(index)}>▼</span>
                </div>
                <p className="message-text">
                  {CryptoJS.AES.decrypt(msg.text, SECRET_KEY).toString(CryptoJS.enc.Utf8)}
                </p>
                <div className="message-footer">
                  <span className="message-time">{msg.time}</span>
                  {msg.type === "sent" && <span className="message-status">✓✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="message-input-area">
          <div className="input-actions">
            <button className="action-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
            <button className="action-btn" onClick={() => handleFeatureAlert('Attachments')}>📎</button>
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            className={`send-btn ${message.trim() ? 'active' : ''}`} 
            onClick={sendMessage}
          >
            ➤
          </button>
          {showEmojiPicker && (
            <div className="emoji-mini-picker">
              {['❤️', '👍', '😂', '🔥', '🚀', '🔒'].map(emoji => (
                <span key={emoji} onClick={() => { setMessage(prev => prev + emoji); setShowEmojiPicker(false); }}>{emoji}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {(showContactInfo || showSettings) && (
        <div className="contact-info-sidebar">
          <div className="sidebar-header">
            <button className="icon-btn" onClick={() => { setShowContactInfo(false); setShowSettings(false); }}>✕</button>
            <span>{showSettings ? 'Settings' : 'Contact Info'}</span>
          </div>
          <div className="sidebar-body">
            {showSettings ? (
              <div className="settings-list">
                 <div className="setting-item">
                    <span>🔔 Notifications</span>
                    <input type="checkbox" defaultChecked />
                 </div>
                 <div className="setting-item">
                    <span>🌙 Dark Mode</span>
                    <input type="checkbox" defaultChecked />
                 </div>
                 <div className="setting-item">
                    <span>🔒 Privacy Lock</span>
                    <input type="checkbox" />
                 </div>
                 <div className="setting-item">
                    <span>🧹 Clear Cache</span>
                    <button onClick={() => alert('Cache cleared!')}>Run</button>
                 </div>
              </div>
            ) : (
              <>
                <div className="contact-profile">
                  <div className="avatar-large">{activeChat?.name[0]}</div>
                  <h2>{activeChat?.name}</h2>
                  <p>{activeChat?.id === 'global' ? 'Public Group' : '+1 234 567 890'}</p>
                </div>
                <div className="contact-section-item">
                   <h4>About</h4>
                   <p>SecureChat user. Privacy enthusiast.</p>
                </div>
                <div className="contact-section-item">
                   <h4>Media, Links and Docs</h4>
                   <div className="media-preview">
                      <div className="media-box"></div>
                      <div className="media-box"></div>
                      <div className="media-box"></div>
                   </div>
                </div>
                <div className="contact-actions">
                   <button className="danger-btn" onClick={() => handleFeatureAlert('Block User')}>Block {activeChat?.name}</button>
                   <button className="danger-btn" onClick={() => handleFeatureAlert('Report User')}>Report {activeChat?.name}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;



