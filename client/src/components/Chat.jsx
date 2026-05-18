import { useEffect, useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

import io from "socket.io-client";

import CryptoJS from "crypto-js";

const socket = io("http://localhost:5000");

const SECRET_KEY = "securechatkey";

// ── Professional SVG Icon Library ──────────────────────────────────────────
const Ic = {
  Shield:       ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Lock:         ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Phone:        ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.3 19.79 19.79 0 0 1 1.61 4.7 2 2 0 0 1 3.6 2.5h3a2 2 0 0 1 2 1.72c.128.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.09 6.09l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 17.5z"/></svg>,
  PhoneOff:     ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.5 16.5L19.59 19.59A2 2 0 0 1 17.32 21.6a19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.33 12.7 19.79 19.79 0 0 1 1.26 4.1a2 2 0 0 1 1.99-2h3a2 2 0 0 1 2 1.72c.1.733.27 1.454.51 2.15"/><path d="M14 3.62a10 10 0 0 1 7 7"/></svg>,
  Video:        ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  Settings:     ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Upload:       ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  VolumeOn:     ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  VolumeOff:    ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>,
  Trash:        ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Ban:          ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  File:         ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
  Download:     ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>,
  Smile:        ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  Paperclip:    ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  Send:         ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Bell:         ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Moon:         ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Palette:      ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125C12.965 18.9 12.818 18.538 12.818 18a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  Database:     ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  Globe:        ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Zap:          ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Key:          ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  Copy:         ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  ChevronDown:  ({s=13})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  X:            ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check:        ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  CheckCheck:   ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>,
  Plus:         ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Info:         ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  LogOut:       ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  MoreVertical: ({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>,
};

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
  const [isUnlocking, setIsUnlocking] = useState(false);
  const callIntervalRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ── New Feature States ────────────────────────────────────────────────
  const [replyTo, setReplyTo]             = useState(null);
  const [searchInChat, setSearchInChat]   = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [messageReactions, setMessageReactions] = useState({});
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [isRecording, setIsRecording]     = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [starredMsgs, setStarredMsgs]     = useState(new Set());
  const [forwardMsg, setForwardMsg]       = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);

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
    
    setIsUnlocking(true);
    setTimeout(() => {
      setIsUnlocking(false);
      setChatStarted(true);
      socket.emit("get_chats", username.trim());
      socket.emit("get_user_data", username.trim());
      socket.emit("get_messages", "global");
    }, 1500);
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
      replyRef: replyTo ? { username: replyTo.username, text: replyTo.text } : null,
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
    setReplyTo(null);
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


  const QUICK_REACTIONS = ['👍','❤️','😂','😮','😢','🔥'];

  function toggleReaction(msgIndex, emoji) {
    const key = activeChatId + '-' + msgIndex;
    setMessageReactions(prev => {
      const arr = prev[key] ? [...prev[key]] : [];
      const idx = arr.findIndex(r => r.emoji === emoji);
      if (idx >= 0) {
        const updated = [...arr];
        if (updated[idx].mine) {
          updated[idx] = { ...updated[idx], count: updated[idx].count - 1, mine: false };
          if (updated[idx].count === 0) updated.splice(idx, 1);
        } else {
          updated[idx] = { ...updated[idx], count: updated[idx].count + 1, mine: true };
        }
        return { ...prev, [key]: updated };
      }
      return { ...prev, [key]: [...arr, { emoji, count: 1, mine: true }] };
    });
    setShowReactionPicker(null);
  }

  function pinMessage(msg) {
    try {
      const decrypted = CryptoJS.AES.decrypt(msg.text, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      setPinnedMessage({ text: decrypted, username: msg.username });
      showToast('Message pinned', 'success');
    } catch(e) {}
    setActiveMsgMenu(null);
  }

  function toggleStar(index) {
    setStarredMsgs(prev => {
      const key = activeChatId + '-' + index;
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
    setActiveMsgMenu(null);
  }

  function forwardMessage(msg) {
    setForwardMsg(msg);
    setShowForwardModal(true);
    setActiveMsgMenu(null);
  }

  function doForward(targetChatId) {
    if (!forwardMsg) return;
    const messageData = {
      username,
      text: forwardMsg.text,
      type: 'sent',
      chatId: targetChatId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      forwarded: true,
    };
    setChatMessages(prev => ({ ...prev, [targetChatId]: [...(prev[targetChatId] || []), messageData] }));
    socket.emit('send_message', messageData);
    setShowForwardModal(false);
    setForwardMsg(null);
    showToast('Message forwarded!', 'success');
  }

  function startVoiceNote() {
    if (isRecording) {
      setIsRecording(false);
      showToast('Voice note sent (demo)', 'success');
      const vMsg = {
        username,
        text: CryptoJS.AES.encrypt('[VOICE:0:12]', SECRET_KEY).toString(),
        type: 'sent',
        chatId: activeChatId,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => ({ ...prev, [activeChatId]: [...(prev[activeChatId] || []), vMsg] }));
      socket.emit('send_message', vMsg);
    } else {
      setIsRecording(true);
      setTimeout(() => setIsRecording(false), 30000);
    }
  }

  function replyMessage(msg, index) {
    try {
      const decrypted = CryptoJS.AES.decrypt(msg.text, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      setReplyTo({ index, text: decrypted.substring(0, 60), username: msg.username });
    } catch(e) {}
    setActiveMsgMenu(null);
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
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMsg: `[File] ${file.name}`, time: messageData.time } : c));
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


  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChatId]);

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
      <div className="join-page new-login-bg">
        <div className={`glass-morphism login-card premium-login ${isUnlocking ? 'unlocking' : ''}`}>
          {isUnlocking ? (
            <div className="unlock-animation-container">
              <div className="unlock-icon" style={{display:'flex',justifyContent:'center',color:'var(--accent-color)'}}><Ic.Lock s={52}/></div>
              <h2 className="decrypting-text">Decrypting Keys...</h2>
              <div className="progress-bar"><div className="progress-fill"></div></div>
            </div>
          ) : (
            <>
              <div className="login-header">
                <div className="login-lock-icon" style={{display:"flex",justifyContent:"center",color:"var(--accent-color)"}}><Ic.Lock s={48}/></div>
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
                    onKeyPress={(e) => e.key === 'Enter' && joinChat()}
                  />
                </div>
                <button className="join-btn premium-btn" onClick={joinChat}>
                  Connect Securely
                </button>
                <div className="login-footer">
                  <p style={{display:'inline-flex',alignItems:'center',gap:'0.4rem'}}><Ic.Shield s={14}/>AES-256 Bit Encryption Active</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const activeChat = chats.find(c => c.active);
  return (
    <div className="chat-wrapper">
      {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-icon">{toast.type === "success" ? <Ic.Check /> : toast.type === "error" ? <Ic.X /> : <Ic.Info />}</div>
          <div className="toast-message">{toast.message}</div>
        </div>
      )}

      {settings.privacyLock && isLocked && (
        <div className="lock-screen">
          <div className="lock-card">
            <div className="avatar-large" style={{display:'flex',alignItems:'center',justifyContent:'center',color:'var(--accent-color)'}}><Ic.Lock s={48}/></div>
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
                <span className="icon" style={{display:'flex'}}><Ic.PhoneOff s={18}/></span>
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
          <button className="icon-btn" title="New Chat" onClick={() => setShowNewChatModal(true)}><Ic.Plus /></button>
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
                    <div className="chat-avatar" style={{position:'relative'}}>
                      {chat.name?.[0]}
                      <span className="online-dot" style={{background: chat.id === 'global' || chat.id === '1' ? '#27c93f' : '#888'}}></span>
                    </div>
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
                  <div className="status-avatar pulse" style={{display:'flex',alignItems:'center',justifyContent:'center',color:'var(--accent-color)'}}><Ic.Shield s={22}/></div>
                  <div className="status-info">
                     <h4>Security Shield: Active</h4>
                     <p>All nodes synchronized</p>
                  </div>
                  <div className="status-badge">98% Safe</div>
               </div>
               
               <div className="status-group-title">Live Network Feed</div>
               <div className="status-item premium">
                  <div className="status-avatar update" style={{display:'flex',alignItems:'center',justifyContent:'center',color:'var(--accent-color)'}}><Ic.Globe s={22}/></div>
                  <div className="status-info">
                     <h4>Global Node Cluster</h4>
                     <p>12 nodes active in Zurich, SG, NY</p>
                  </div>
                  <div className="status-indicator online"></div>
               </div>

               <div className="status-group-title">Platform Changelog</div>
               <div className="status-item">
                  <div className="status-avatar update" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent-color)"}}><Ic.Zap s={22}/></div>
                  <div className="status-info">
                     <h4>Quantum-Resistant Layer</h4>
                     <p>v2.5.0 Deployment successful</p>
                  </div>
               </div>
               <div className="status-item">
                  <div className="status-avatar update" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent-color)"}}><Ic.Key s={22}/></div>
                  <div className="status-info">
                     <h4>Multi-sig Key Exchange</h4>
                     <p>Updated for group conversations</p>
                  </div>
               </div>
               <div className="status-item">
                  <div className="status-avatar update" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent-color)"}}><Ic.Shield s={22}/></div>
                  <div className="status-info">
                     <h4>My Security Pulse</h4>
                     <p>Encrypted & Secure</p>
                  </div>
               </div>
               <div className="status-group-title">Recent Updates</div>
               <div className="status-item">
                  <div className="status-avatar update" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent-color)"}}><Ic.Zap s={22}/></div>
                  <div className="status-info">
                     <h4>Node v2.4.0</h4>
                     <p>Optimized packet delivery</p>
                  </div>
               </div>
               <div className="status-item">
                  <div className="status-avatar update" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent-color)"}}><Ic.Key s={22}/></div>
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
            <button className="icon-btn" onClick={() => setShowSettings(true)} title="Settings"><Ic.Settings /></button>
            <button className="icon-btn" onClick={disconnectWallet} title="Logout"><Ic.LogOut /></button>
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
            <button className="icon-btn" title="Search Messages" onClick={() => { setShowSearchBar(!showSearchBar); setSearchInChat(''); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
            <button className="icon-btn" title="Video Call" onClick={() => startCall('Video Call')}><Ic.Video /></button>
            <button className="icon-btn" title="Voice Call" onClick={() => startCall('Voice Call')}><Ic.Phone /></button>
            <div className="divider"></div>
            <div className="more-options-container">
              <button className="icon-btn" title="More Options" onClick={() => setShowMoreOptions(!showMoreOptions)}><Ic.MoreVertical /></button>
              {showMoreOptions && (
                <div className="options-dropdown">
                  <div className="option-item" onClick={exportChat} style={{display:'flex',alignItems:'center',gap:'0.6rem'}}><Ic.Upload s={14}/> Export Chat (.txt)</div>
                  <div className="option-item" onClick={() => { setIsMuted(!isMuted); setShowMoreOptions(false); }} style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>{isMuted ? <><Ic.VolumeOn s={14}/> Unmute</> : <><Ic.VolumeOff s={14}/> Mute</>}</div>
                  <div className="option-item danger" onClick={() => { clearChat(); setShowMoreOptions(false); }} style={{display:'flex',alignItems:'center',gap:'0.6rem'}}><Ic.Trash s={14}/> Clear Chat</div>
                  <div className="option-item danger" onClick={() => { handleBlock(); setShowMoreOptions(false); }} style={{display:'flex',alignItems:'center',gap:'0.6rem'}}><Ic.Ban s={14}/> Block</div>
                </div>
              )}
            </div>
          </div>
        </div>


        {pinnedMessage && (
          <div className="pinned-bar" onClick={() => {}}>
            <div className="pinned-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1v6l2 4H6l2-4V1h8zm-2 14v8h-4v-8H4l2-2h12l2 2h-4z"/></svg></div>
            <div className="pinned-content">
              <span className="pinned-label">Pinned</span>
              <span className="pinned-text">{pinnedMessage.username}: {pinnedMessage.text}</span>
            </div>
            <button className="pinned-close" onClick={() => setPinnedMessage(null)}>
              <Ic.X s={13}/>
            </button>
          </div>
        )}
        {showSearchBar && (
          <div className="search-in-chat-bar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input autoFocus type="text" placeholder="Search in conversation..." value={searchInChat} onChange={e => setSearchInChat(e.target.value)}/>
            <span className="search-count">
              {searchInChat ? messages.filter(m => { try { return CryptoJS.AES.decrypt(m.text, SECRET_KEY).toString(CryptoJS.enc.Utf8).toLowerCase().includes(searchInChat.toLowerCase()); } catch(e) { return false; } }).length + ' found' : ''}
            </span>
            <button onClick={() => { setShowSearchBar(false); setSearchInChat(''); }}><Ic.X s={14}/></button>
          </div>
        )}
        <div className="messages-area whatsapp-bg">
          <div className="encryption-notice">
            <span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}><Ic.Shield s={14}/> Messages are end-to-end encrypted.</span>
          </div>
          {messages.length === 0 && (
            <div className="empty-chat">No messages yet. Send a secure message!</div>
          )}
          {messages.filter(msg => {
              if (!searchInChat) return true;
              try { return CryptoJS.AES.decrypt(msg.text, SECRET_KEY).toString(CryptoJS.enc.Utf8).toLowerCase().includes(searchInChat.toLowerCase()); } catch(e) { return false; }
            }).map((msg, index) => (
            <div key={index} className={`message-group ${msg.type} ${starredMsgs.has(activeChatId+'-'+index) ? 'starred-msg' : ''}`}>
              {msg.type === "received" && (
                <span className="message-user">{msg.username}</span>
              )}
              <div className={`message-bubble ${msg.type}`}>
                <div className="message-header-actions">
                  <span className="msg-dropdown" onClick={() => setActiveMsgMenu(activeMsgMenu === index ? null : index)} style={{display:'flex',alignItems:'center'}}><Ic.ChevronDown /></span>
                  {activeMsgMenu === index && (
                    <div className="msg-context-menu">
                      <div className="msg-menu-item" style={{display:'flex',alignItems:'center',gap:'0.5rem'}} onClick={() => replyMessage(msg, index)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg> Reply
                      </div>
                      <div className="msg-menu-item" style={{display:'flex',alignItems:'center',gap:'0.5rem'}} onClick={() => toggleStar(index)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill={starredMsgs.has(activeChatId+'-'+index) ? 'gold' : 'none'} stroke={starredMsgs.has(activeChatId+'-'+index) ? 'gold' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        {starredMsgs.has(activeChatId+'-'+index) ? 'Unstar' : 'Star'}
                      </div>
                      <div className="msg-menu-item" style={{display:'flex',alignItems:'center',gap:'0.5rem'}} onClick={() => pinMessage(msg)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg> Pin
                      </div>
                      <div className="msg-menu-item" style={{display:'flex',alignItems:'center',gap:'0.5rem'}} onClick={() => forwardMessage(msg)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 17 20 12 15 7"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/></svg> Forward
                      </div>
                      <div className="msg-menu-item" style={{display:'flex',alignItems:'center',gap:'0.5rem'}} onClick={() => { 
                          try {
                              const dec = CryptoJS.AES.decrypt(msg.text, SECRET_KEY).toString(CryptoJS.enc.Utf8);
                              navigator.clipboard.writeText(dec); 
                              showToast("Copied to clipboard", "success");
                          } catch(e){}
                          setActiveMsgMenu(null); 
                      }}><Ic.Copy s={13}/> Copy</div>
                      <div className="msg-menu-item danger" style={{display:'flex',alignItems:'center',gap:'0.5rem'}} onClick={() => deleteMessage(index)}><Ic.Trash s={13}/> Delete</div>
                    </div>
                  )}
                </div>
                {msg.replyRef && (
                    <div className="reply-snippet">
                      <span className="reply-user">{msg.replyRef.username}</span>
                      <span className="reply-text">{msg.replyRef.text}</span>
                    </div>
                  )}
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
                                <div className="file-icon" style={{display:"flex",color:"var(--accent-color)"}}><Ic.File s={32}/></div>
                                <div className="file-details">
                                  <span className="file-name">{match[1]}</span>
                                  <span className="file-size">{match[2]} - Secure File</span>
                                </div>
                                <button className="file-download-btn" onClick={() => showToast("Decrypting file...", "info")} style={{display:"flex",alignItems:"center",justifyContent:"center"}}><Ic.Download s={14}/></button>
                              </div>
                            );
                         }
                      }
                      if (decrypted.startsWith('[VOICE:')) {
                        const match = decrypted.match(/\[VOICE:(\d+):(\d+)\]/);
                        return (
                          <div className="voice-note">
                            <button className="voice-play-btn" onClick={() => showToast('Voice playback coming soon', 'info')}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            </button>
                            <div className="voice-waveform">
                              {[...Array(20)].map((_,i) => <span key={i} className="wave-bar" style={{height: (Math.sin(i*0.8)+1.2)*12 + 'px'}}></span>)}
                            </div>
                            <span className="voice-duration">0:{match ? match[2].padStart(2,'0') : '00'}</span>
                          </div>
                        );
                      }
                      return <p className="message-text">{decrypted}</p>;
                    } catch (e) {
                      return <p className="message-text">Message encrypted or corrupted</p>;
                    }
                  })()}
                </div>
                <div className="message-footer">
                  <span className="message-time">{msg.time}</span>
                  {msg.type === "sent" && <span className="message-status" style={{display:'inline-flex',alignItems:'center'}}><Ic.CheckCheck s={14}/></span>}
                </div>
              {messageReactions[activeChatId+'-'+index]?.length > 0 && (
                  <div className="reactions-row">
                    {messageReactions[activeChatId+'-'+index].map((r,ri) => (
                      <span key={ri} className={`reaction-chip ${r.mine ? 'mine' : ''}`} onClick={() => toggleReaction(index, r.emoji)}>
                        {r.emoji} {r.count > 1 ? r.count : ''}
                      </span>
                    ))}
                    <span className="reaction-add-btn" onClick={() => setShowReactionPicker(showReactionPicker === index ? null : index)}>+</span>
                  </div>
                )}
                {showReactionPicker === index && (
                  <div className="reaction-picker">
                    {QUICK_REACTIONS.map(em => (
                      <span key={em} className="reaction-option" onClick={() => toggleReaction(index, em)}>{em}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}/>
        </div>

        <div className="message-input-area">
          {replyTo && (
            <div className="reply-bar">
              <div className="reply-bar-content">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                <span className="reply-bar-user">{replyTo.username}</span>
                <span className="reply-bar-text">{replyTo.text}{replyTo.text.length >= 60 ? '...' : ''}</span>
              </div>
              <button onClick={() => setReplyTo(null)}><Ic.X s={14}/></button>
            </div>
          )}
          <div className="input-actions">
            <button className="action-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><Ic.Smile /></button>
            <button className="action-btn" onClick={handleAttachment}><Ic.Paperclip /></button>
          </div>
          <input 
            type="text" 
            placeholder={isBlocked ? "You cannot send messages to blocked contacts." : "Type a message..."}
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isBlocked}
          />
          {!message.trim() && !isBlocked && (
            <button className={`mic-btn ${isRecording ? 'recording' : ''}`} onClick={startVoiceNote} title={isRecording ? 'Stop recording' : 'Voice note'}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill={isRecording ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </button>
          )}
          {(message.trim() || isBlocked) && (
            <button 
              className={`send-btn ${(message.trim() && !isBlocked) ? 'active' : ''}`} 
              onClick={sendMessage}
              disabled={isBlocked}
            >
              <Ic.Send s={17}/>
            </button>
          )}
          {showEmojiPicker && (
            <div className="emoji-picker-container" style={{ position: 'absolute', bottom: '100%', right: '0', zIndex: 1000, marginBottom: '10px' }}>
              <EmojiPicker 
                theme={settings.darkMode ? "dark" : "light"} 
                onEmojiClick={(emojiObject) => { setMessage(prev => prev + emojiObject.emoji); setShowEmojiPicker(false); }} 
              />
            </div>
          )}
        </div>
      </div>

      {(showContactInfo || showSettings) && (
        <div className="contact-info-sidebar">
          <div className="sidebar-header">
            <button className="icon-btn" onClick={() => { setShowContactInfo(false); setShowSettings(false); }}><Ic.X /></button>
            <span>{showSettings ? 'Settings' : 'Contact Info'}</span>
          </div>
          <div className="sidebar-body">
            {showSettings ? (
              <div className="settings-list">
                 <div className="settings-group">
                    <div className="settings-group-title">Account & Security</div>
                    <div className="setting-item-premium">
                       <div className="setting-label">
                          <span className="setting-icon" style={{display:"flex",color:"var(--accent-color)"}}><Ic.Bell s={17}/></span>
                          <span>Notifications</span>
                       </div>
                       <label className="switch">
                          <input type="checkbox" checked={settings.notifications} onChange={() => toggleSetting('notifications')} />
                          <span className="slider"></span>
                       </label>
                    </div>
                    <div className="setting-item-premium">
                       <div className="setting-label">
                          <span className="setting-icon" style={{display:"flex",color:"var(--accent-color)"}}><Ic.Lock s={17}/></span>
                          <span>Privacy Lock</span>
                       </div>
                       <label className="switch">
                          <input type="checkbox" checked={settings.privacyLock} onChange={() => toggleSetting('privacyLock')} />
                          <span className="slider"></span>
                       </label>
                    </div>
                    <div className="setting-item-premium">
                       <div className="setting-label">
                          <span className="setting-icon" style={{display:"flex",color:"var(--accent-color)"}}><Ic.Trash s={17}/></span>
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
                          <span className="setting-icon" style={{display:"flex",color:"var(--accent-color)"}}><Ic.Moon s={17}/></span>
                          <span>Dark Mode</span>
                       </div>
                       <label className="switch">
                          <input type="checkbox" checked={settings.darkMode} onChange={() => toggleTheme('dark')} />
                          <span className="slider"></span>
                       </label>
                    </div>
                    <div className="setting-item-premium">
                       <div className="setting-label">
                          <span className="setting-icon" style={{display:"flex",color:"var(--accent-color)"}}><Ic.Palette s={17}/></span>
                          <span>Midnight Theme</span>
                       </div>
                       <button className="theme-btn" onClick={() => toggleTheme('midnight')}>Toggle</button>
                    </div>
                 </div>

                 <div className="settings-group">
                    <div className="settings-group-title">System</div>
                    <div className="setting-item-premium">
                       <div className="setting-label">
                          <span className="setting-icon" style={{display:"flex",color:"var(--accent-color)"}}><Ic.Database s={17}/></span>
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
                      <div className="media-box has-image"><div className="lock-overlay" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.4)"}}><Ic.Lock s={24}/></div></div>
                      <div className="media-box has-image"><div className="lock-overlay" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.4)"}}><Ic.Lock s={24}/></div></div>
                      <div className="media-box has-image"><div className="lock-overlay" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.4)"}}><Ic.Lock s={24}/></div></div>
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


      {showForwardModal && (
        <div className="modal-overlay">
          <div className="glass-morphism modal-content">
            <h3>Forward Message</h3>
            <p>Select a chat to forward to:</p>
            <div className="forward-chat-list">
              {chats.map(ch => (
                <div key={ch.id} className="forward-chat-item" onClick={() => doForward(ch.id)}>
                  <div className="chat-avatar">{ch.name?.[0]}</div>
                  <span>{ch.name}</span>
                </div>
              ))}
            </div>
            <div className="modal-btns">
              <button className="cancel-btn" onClick={() => setShowForwardModal(false)}>Cancel</button>
            </div>
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



