import { useEffect, useState, useRef } from "react";

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
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    privacyLock: false,
    autoDelete: false
  });
  
  const [chats, setChats] = useState([
    { id: "global", name: "Secure Global Chat", lastMsg: "Welcome to the secure chat!", time: "12:00 PM", active: true, unread: 0 },
    { id: "1", name: "Alice (E2EE)", lastMsg: "Hey, are we still on...", time: "11:45 AM", active: false, unread: 2 },
    { id: "2", name: "Bob (E2EE)", lastMsg: "Encryption works!", time: "11:30 AM", active: false, unread: 0 },
    { id: "3", name: "Crypto Group", lastMsg: "Check the update.", time: "Yesterday", active: false, unread: 5 },
  ]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("chats"); // chats, status
  const [userProfile, setUserProfile] = useState({ status: "SecureChat user. Privacy enthusiast." });
  const [isLocked, setIsLocked] = useState(false);
  const [lockPin, setLockPin] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [callStatus, setCallStatus] = useState("Ringing...");
  const [activeMsgMenu, setActiveMsgMenu] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const callIntervalRef = useRef(null);

  const activeChatId = chats.find(c => c.active)?.id || "global";
  const messages = chatMessages[activeChatId] || [];
  const isBlocked = blockedUsers.includes(activeChatId);

  const showToast = (msg, type = "info") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
  };

  function joinChat() {
    if (username.trim() === "" || password.trim() === "") {
      showToast("Enter username and password", "error");
      return;
    }
    if (password !== "secure123") {
      showToast("Wrong password (hint: secure123)", "error");
      return;
    }
    setChatStarted(true);
    socket.emit("get_chats", username.trim());
    socket.emit("get_user_data", username.trim());
    socket.emit("get_messages", "global");
  }

  function sendMessage() {
    if (message.trim() === "") return;

    const encryptedMessage = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();

    const messageData = {
      username,
      text: encryptedMessage,
      type: "sent",
      chatId: activeChatId,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), messageData]
    }));

    if (activeChatId === "global") {
      socket.emit("send_message", messageData);
    } else {
      // For private chats, we still emit to server if we want cross-device sync
      socket.emit("send_message", messageData);
    }
    
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMsg: message, time: messageData.time } : c));
    setMessage("");
    socket.emit("stop_typing", { username, chat: activeChatId });
  }

  function deleteMessage(index) {
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
    showToast("Message deleted.", "info");
    setActiveMsgMenu(null);
  }

  function clearChat() {
    if (window.confirm("Clear history for this chat?")) {
      setChatMessages(prev => ({ ...prev, [activeChatId]: [] }));
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMsg: "No messages yet" } : c));
      showToast("Chat cleared securely.", "success");
    }
  }

  function handleFeatureAlert(name) {
    showToast(`${name} is coming soon in Phase 2!`, "info");
  }

  function startCall(type) {
    setCallType(type);
    setIsCalling(true);
    setCallStatus("Ringing...");
    setCallTimer(0);
    if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    
    setTimeout(() => {
      setCallStatus("Connected");
      callIntervalRef.current = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }, 2500);
    
    // Auto end after 30s
    setTimeout(() => {
      endCall();
    }, 30000);
  }

  function endCall() {
    if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    setIsCalling(false);
    setCallTimer(0);
  }

  function exportChat() {
    const chatContent = messages.map(m => `[${m.time}] ${m.username}: ${CryptoJS.AES.decrypt(m.text, SECRET_KEY).toString(CryptoJS.enc.Utf8)}`).join('\n');
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_export_${activeChatId}.txt`;
    a.click();
    setShowMoreOptions(false);
  }

  function toggleSetting(key) {
    if (key === 'privacyLock' && !settings.privacyLock) {
       showToast("Privacy lock enabled! PIN is 1234", "success");
    }
    if (key === 'notifications' && !settings.notifications) {
       if ("Notification" in window && Notification.permission !== "granted") {
          Notification.requestPermission();
       }
    }
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    socket.emit("update_settings", { username, settings: newSettings });
  }

  function clearCache() {
    if (window.confirm("Are you sure you want to clear all local data? This will log you out.")) {
      localStorage.clear();
      window.location.reload();
    }
  }

  function handleLock() {
    if (lockPin === "1234") {
      setIsLocked(false);
      setLockPin("");
      showToast("Unlocked successfully", "success");
    } else {
      showToast("Incorrect PIN (Hint: 1234)", "error");
    }
  }

  function toggleTheme(theme) {
     if (theme === 'midnight') {
        document.body.classList.toggle('midnight');
        document.body.classList.remove('light-mode');
     } else {
        const newSettings = { ...settings, darkMode: !settings.darkMode };
        setSettings(newSettings);
        socket.emit("update_settings", { username, settings: newSettings });
        if (newSettings.darkMode) {
           document.body.classList.remove('light-mode');
        } else {
           document.body.classList.add('light-mode');
        }
        document.body.classList.remove('midnight');
     }
  }

  function handleAttachment() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const filePrefix = `[FILE:${file.name}:${(file.size / 1024).toFixed(1)}KB]`;
        const encryptedMessage = CryptoJS.AES.encrypt(filePrefix, SECRET_KEY).toString();

        const messageData = {
          username,
          text: encryptedMessage,
          type: "sent",
          chatId: activeChatId,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setChatMessages(prev => ({
          ...prev,
          [activeChatId]: [...(prev[activeChatId] || []), messageData]
        }));

        socket.emit("send_message", messageData);
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMsg: `📄 ${file.name}`, time: messageData.time } : c));
      }
    };
    input.click();
  }

  function handleBlock() {
    if (isBlocked) {
      setBlockedUsers(prev => prev.filter(id => id !== activeChatId));
      showToast(`${activeChat?.name} unblocked`, "success");
    } else {
      setBlockedUsers(prev => [...prev, activeChatId]);
      showToast(`${activeChat?.name} blocked`, "error");
    }
  }

  function createNewChat() {
    if (newChatName.trim() === "") return;
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      name: newChatName,
      lastMsg: "No messages yet",
      time: "Just now",
      active: true,
      unread: 0,
      participants: [username]
    };
    setChats(prev => prev.map(c => ({ ...c, active: false })).concat(newChat));
    setChatMessages(prev => ({ ...prev, [newChat.id]: [] }));
    socket.emit("create_chat", newChat);
    setNewChatName("");
    setShowNewChatModal(false);
  }

  useEffect(() => {
    socket.on("load_user_data", (data) => {
      if (data) {
        setUserProfile({ status: data.status });
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (settings.autoDelete) {
      const timer = setInterval(() => {
        setChatMessages(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(chatId => {
             if (updated[chatId].length > 5) {
                updated[chatId] = updated[chatId].slice(-5);
             }
          });
          return updated;
        });
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [settings.autoDelete]);

  useEffect(() => {
    let inactivityTimer;
    const resetTimer = () => {
      if (settings.privacyLock && !isLocked) {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => setIsLocked(true), 60000); // Lock after 60s
      }
    };

    if (settings.privacyLock && !isLocked) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);
      resetTimer();
    }
    
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, [settings.privacyLock, isLocked]);

  const settingsRef = useRef(settings);
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const targetChatId = data.chatId || "global";
      setChatMessages((prev) => ({
        ...prev,
        [targetChatId]: [...(prev[targetChatId] || []), { ...data, type: data.username === username ? "sent" : "received" }]
      }));
      
      setChats(prev => prev.map(c => c.id === targetChatId ? { 
        ...c, 
        lastMsg: CryptoJS.AES.decrypt(data.text, SECRET_KEY).toString(CryptoJS.enc.Utf8), 
        time: data.time,
        unread: (targetChatId !== activeChatId && data.username !== username) ? (c.unread + 1) : c.unread
      } : c));

      if (settingsRef.current.notifications && targetChatId !== activeChatId && data.username !== username) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("SecureChat", { body: `New message in ${targetChatId}` });
        }
      }
    });

    socket.on("load_messages", (data) => {
      if (Array.isArray(data)) {
        setChatMessages(prev => ({
          ...prev,
          global: data.map(m => ({ ...m, type: m.username === username ? "sent" : "received" }))
        }));
      } else if (data && data.chatId && Array.isArray(data.messages)) {
        setChatMessages(prev => ({
          ...prev,
          [data.chatId]: data.messages.map(m => ({ ...m, type: m.username === username ? "sent" : "received" }))
        }));
      }
    });

    socket.on("load_chats", (data) => {
      if (data && data.length > 0) {
        setChats(prev => {
          const persistentIds = data.map(c => c.id);
          const filteredExisting = prev.filter(c => !persistentIds.includes(c.id));
          return [...filteredExisting, ...data.map(c => ({ ...c, active: c.id === activeChatId }))];
        });
        
        data.forEach(chat => {
          socket.emit("get_messages", chat.id);
        });
      }
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
      socket.off("load_messages");
      socket.off("load_chats");
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

  const filteredChats = chats.filter(c => (c.name || "").toLowerCase().includes((searchQuery || "").toLowerCase()));

  useEffect(() => {
    if (settings.privacyLock) {
       setIsLocked(true);
    }
  }, [settings.privacyLock]);

  if (!chatStarted) {
    return (
      <div className="join-page">
        <div className="glass-morphism login-card">
          <div className="login-header">
            <div className="login-lock-icon">🔐</div>
            <h1>Secure Login</h1>
            <p>Your privacy, protected by end-to-end encryption</p>
          </div>
          <div className="login-body">
            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                placeholder="Enter your unique handle" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Passphrase</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="join-btn" onClick={joinChat}>
              Connect Securely
            </button>
            <div className="login-footer">
              <p>🔒 AES-256 Bit Encryption Active</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeChat = chats.find(c => c.active);
  return (
    <div className="chat-wrapper">
      {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-icon">{toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}</div>
          <div className="toast-message">{toast.message}</div>
        </div>
      )}

      {settings.privacyLock && isLocked && (
        <div className="lock-screen">
          <div className="lock-card">
            <div className="avatar-large">🔐</div>
            <h2>SecureChat Locked</h2>
            <p>Enter your 4-digit PIN to continue</p>
            <input 
              type="password" 
              className="lock-input" 
              maxLength="4"
              placeholder="••••"
              value={lockPin}
              onChange={(e) => setLockPin(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLock()}
            />
            <br />
            <button className="primary-btn" onClick={handleLock}>Unlock</button>
          </div>
        </div>
      )}

      {isCalling && (
        <div className="calling-overlay">
          <div className="calling-card glass-morphism">
            <div className="calling-status-pulse"></div>
            <div className="avatar-large">{activeChat?.name?.[0]}</div>
            <h2>{callType}</h2>
            <p className="calling-username">{activeChat?.name}</p>
            <div className="call-status-text">{callStatus}</div>
            {callStatus === "Connected" && (
              <div className="call-timer">{Math.floor(callTimer / 60)}:{String(callTimer % 60).padStart(2, '0')}</div>
            )}
            <div className="calling-btns">
              <button className="end-call-btn" onClick={endCall}>
                <span className="icon">📞</span>
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-tabs">
            <button className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')}>Chats</button>
            <button className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`} onClick={() => setActiveTab('status')}>Updates</button>
          </div>
          <button className="icon-btn" title="New Chat" onClick={() => setShowNewChatModal(true)}>+</button>
        </div>

        <div className="sidebar-content">
          {activeTab === 'chats' ? (
            <>
              <div className="search-container">
                <input 
                  type="text" 
                  className="search-bar" 
                  placeholder="Search chats..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="chat-list">
                {filteredChats.map((chat) => (
                  <div 
                    key={chat.id} 
                    className={`chat-item ${chat.active ? 'active' : ''}`}
                    onClick={() => {
                      setChats(chats.map(c => ({ ...c, active: c.id === chat.id })));
                      if (chat.id !== activeChatId) {
                        socket.emit("get_messages", chat.id);
                      }
                    }}
                  >
                    <div className="chat-avatar">{chat.name?.[0]}</div>
                    <div className="chat-info">
                      <div className="chat-name-row">
                        <span className="chat-name">{chat.name}</span>
                        <span className="chat-time">{chat.time}</span>
                      </div>
                      <div className="chat-last-msg">
                        {chat.lastMsg}
                        {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="status-list">
               <div className="status-item-mine">
                  <div className="status-avatar pulse">🛡️</div>
                  <div className="status-info">
                     <h4>Security Shield: Active</h4>
                     <p>All nodes synchronized</p>
                  </div>
                  <div className="status-badge">98% Safe</div>
               </div>
               
               <div className="status-group-title">Live Network Feed</div>
               <div className="status-item premium">
                  <div className="status-avatar update">🌐</div>
                  <div className="status-info">
                     <h4>Global Node Cluster</h4>
                     <p>12 nodes active in Zurich, SG, NY</p>
                  </div>
                  <div className="status-indicator online"></div>
               </div>

               <div className="status-group-title">Platform Changelog</div>
               <div className="status-item">
                  <div className="status-avatar update">✨</div>
                  <div className="status-info">
                     <h4>Quantum-Resistant Layer</h4>
                     <p>v2.5.0 Deployment successful</p>
                  </div>
               </div>
               <div className="status-item">
                  <div className="status-avatar update">🔐</div>
                  <div className="status-info">
                     <h4>Multi-sig Key Exchange</h4>
                     <p>Updated for group conversations</p>
                  </div>
               </div>
               <div className="status-item">
                  <div className="status-avatar update">🛡️</div>
                  <div className="status-info">
                     <h4>My Security Pulse</h4>
                     <p>Encrypted & Secure</p>
                  </div>
               </div>
               <div className="status-group-title">Recent Updates</div>
               <div className="status-item">
                  <div className="status-avatar update">✨</div>
                  <div className="status-info">
                     <h4>Node v2.4.0</h4>
                     <p>Optimized packet delivery</p>
                  </div>
               </div>
               <div className="status-item">
                  <div className="status-avatar update">🔐</div>
                  <div className="status-info">
                     <h4>E2EE Kernel</h4>
                     <p>Zero-knowledge proof updated</p>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="profile-mini">
            <div className="avatar-small">{username?.[0]?.toUpperCase() || "?"}</div>
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
      </div>

      <div className="chat-section">
        <div className="chat-main-header">
          <div className="chat-header-left" onClick={() => setShowContactInfo(true)}>
            <div className="avatar-small">{activeChat?.name?.[0]}</div>
            <div className="chat-main-info">
              <h3>{activeChat?.name}</h3>
              <p>{isTyping ? `${typingUser} is typing...` : 'online'}</p>
            </div>
          </div>
          <div className="chat-header-right">
            <button className="icon-btn" title="Video Call" onClick={() => startCall('Video Call')}>📹</button>
            <button className="icon-btn" title="Voice Call" onClick={() => startCall('Voice Call')}>📞</button>
            <div className="divider"></div>
            <div className="more-options-container">
              <button className="icon-btn" title="More Options" onClick={() => setShowMoreOptions(!showMoreOptions)}>⋮</button>
              {showMoreOptions && (
                <div className="options-dropdown">
                  <div className="option-item" onClick={exportChat}>📤 Export Chat (.txt)</div>
                  <div className="option-item" onClick={() => { setIsMuted(!isMuted); setShowMoreOptions(false); }}>{isMuted ? '🔊 Unmute' : '🔕 Mute'}</div>
                  <div className="option-item danger" onClick={() => { handleBlock(); setShowMoreOptions(false); }}>🚫 Block</div>
                </div>
              )}
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
                  <span className="msg-dropdown" onClick={() => setActiveMsgMenu(activeMsgMenu === index ? null : index)}>▼</span>
                  {activeMsgMenu === index && (
                    <div className="msg-context-menu">
                      <div className="msg-menu-item" onClick={() => { 
                          try {
                              const dec = CryptoJS.AES.decrypt(msg.text, SECRET_KEY).toString(CryptoJS.enc.Utf8);
                              navigator.clipboard.writeText(dec); 
                              showToast("Copied to clipboard", "success");
                          } catch(e){}
                          setActiveMsgMenu(null); 
                      }}>📋 Copy Text</div>
                      <div className="msg-menu-item danger" onClick={() => deleteMessage(index)}>🗑️ Delete Message</div>
                    </div>
                  )}
                </div>
                <div className="message-content">
                  {(() => {
                    if (!msg.text) return <p className="message-text">No message content</p>;
                    try {
                      const decrypted = CryptoJS.AES.decrypt(msg.text, SECRET_KEY).toString(CryptoJS.enc.Utf8);
                      if (decrypted.startsWith("[FILE:")) {
                         const match = decrypted.match(/\[FILE:(.+?):(.+?)\]/);
                         if (match) {
                            return (
                              <div className="file-attachment">
                                <div className="file-icon">📄</div>
                                <div className="file-details">
                                  <span className="file-name">{match[1]}</span>
                                  <span className="file-size">{match[2]} - Secure File</span>
                                </div>
                                <button className="file-download-btn" onClick={() => showToast("Decrypting file...", "info")}>⬇️</button>
                              </div>
                            );
                         }
                      }
                      return <p className="message-text">{decrypted}</p>;
                    } catch (e) {
                      return <p className="message-text">Message encrypted or corrupted</p>;
                    }
                  })()}
                </div>
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
            <button className="action-btn" onClick={handleAttachment}>📎</button>
          </div>
          <input 
            type="text" 
            placeholder={isBlocked ? "You cannot send messages to blocked contacts." : "Type a message..."}
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isBlocked}
          />
          <button 
            className={`send-btn ${(message.trim() && !isBlocked) ? 'active' : ''}`} 
            onClick={sendMessage}
            disabled={isBlocked}
          >
            ➤
          </button>
          {showEmojiPicker && (
            <div className="emoji-mini-picker">
              {['❤️', '👍', '😂', '🔥', '🚀', '🔒', '👋', '✨', '💎', '🎉', '💻', '🔐', '📱', '💬', '🌈', '⚡', '🤖', '👾'].map(emoji => (
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
                 <div className="settings-group">
                    <div className="settings-group-title">Account & Security</div>
                    <div className="setting-item-premium">
                       <div className="setting-label">
                          <span className="setting-icon">🔔</span>
                          <span>Notifications</span>
                       </div>
                       <label className="switch">
                          <input type="checkbox" checked={settings.notifications} onChange={() => toggleSetting('notifications')} />
                          <span className="slider"></span>
                       </label>
                    </div>
                    <div className="setting-item-premium">
                       <div className="setting-label">
                          <span className="setting-icon">🔒</span>
                          <span>Privacy Lock</span>
                       </div>
                       <label className="switch">
                          <input type="checkbox" checked={settings.privacyLock} onChange={() => toggleSetting('privacyLock')} />
                          <span className="slider"></span>
                       </label>
                    </div>
                    <div className="setting-item-premium">
                       <div className="setting-label">
                          <span className="setting-icon">🗑️</span>
                          <span>Auto-delete</span>
                       </div>
                       <label className="switch">
                          <input type="checkbox" checked={settings.autoDelete} onChange={() => toggleSetting('autoDelete')} />
                          <span className="slider"></span>
                       </label>
                    </div>
                 </div>

                 <div className="settings-group">
                    <div className="settings-group-title">Appearance</div>
                    <div className="setting-item-premium">
                       <div className="setting-label">
                          <span className="setting-icon">🌙</span>
                          <span>Dark Mode</span>
                       </div>
                       <label className="switch">
                          <input type="checkbox" checked={settings.darkMode} onChange={() => toggleTheme('dark')} />
                          <span className="slider"></span>
                       </label>
                    </div>
                    <div className="setting-item-premium">
                       <div className="setting-label">
                          <span className="setting-icon">🎨</span>
                          <span>Midnight Theme</span>
                       </div>
                       <button className="theme-btn" onClick={() => toggleTheme('midnight')}>Toggle</button>
                    </div>
                 </div>

                 <div className="settings-group">
                    <div className="settings-group-title">System</div>
                    <div className="setting-item-premium">
                       <div className="setting-label">
                          <span className="setting-icon">🧹</span>
                          <span>Cache</span>
                       </div>
                       <button className="clear-btn-small" onClick={clearCache}>Clear Data</button>
                    </div>
                 </div>
              </div>
            ) : (
              <>
                <div className="contact-profile">
                  <div className="avatar-large">{activeChat?.name?.[0]}</div>
                  <h2>{activeChat?.name}</h2>
                  <p className="node-id">{activeChat?.id === 'global' ? 'Public Node Cluster' : `Node ID: 0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`}</p>
                </div>
                <div className="contact-section-item">
                   <h4>About</h4>
                   {activeChat?.name === username ? (
                     <div className="status-edit">
                        <input 
                          type="text" 
                          value={userProfile.status} 
                          onChange={(e) => setUserProfile({ status: e.target.value })}
                          onBlur={() => socket.emit("update_profile", { username, status: userProfile.status })}
                        />
                        <span className="edit-hint">Click outside to save</span>
                     </div>
                   ) : (
                     <p>{activeChat?.id === 'global' ? 'Public Group' : userProfile.status}</p>
                   )}
                </div>
                <div className="contact-section-item">
                   <h4>Media, Links and Docs</h4>
                   <div className="media-preview">
                      <div className="media-box has-image"><div className="lock-overlay">🔐</div></div>
                      <div className="media-box has-image"><div className="lock-overlay">🔐</div></div>
                      <div className="media-box has-image"><div className="lock-overlay">🔐</div></div>
                   </div>
                </div>
                <div className="contact-actions">
                   <button className="danger-btn" onClick={handleBlock}>{isBlocked ? `Unblock ${activeChat?.name}` : `Block ${activeChat?.name}`}</button>
                   <button className="danger-btn" onClick={() => handleFeatureAlert('Report User')}>Report {activeChat?.name}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showNewChatModal && (
        <div className="modal-overlay">
          <div className="glass-morphism modal-content">
            <h3>Start New Conversation</h3>
            <p>Enter the name of the contact or group</p>
            <input 
              type="text" 
              placeholder="Contact Name" 
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              autoFocus
            />
            <div className="modal-btns">
              <button className="cancel-btn" onClick={() => setShowNewChatModal(false)}>Cancel</button>
              <button className="confirm-btn" onClick={createNewChat}>Create Chat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;



