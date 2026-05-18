import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('./Chat.jsx', 'utf8');

// 1. Inject new state vars after callIntervalRef
const anchor = '  const callIntervalRef = useRef(null);';
const newState = `  const callIntervalRef = useRef(null);
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
  const [showForwardModal, setShowForwardModal] = useState(false);`;
c = c.replace(anchor, newState);

// 2. Add scroll-to-bottom effect after the existing autoDelete useEffect
const scrollEffect = `
  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChatId]);
`;
c = c.replace(
  '  const handleTyping = (val) => {',
  scrollEffect + '\n  const handleTyping = (val) => {'
);

// 3. New helper functions — reactions, pin, star, forward, recording
const newHelpers = `
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

`;
c = c.replace(
  '  function clearCache() {',
  newHelpers + '  function clearCache() {'
);

writeFileSync('./Chat.jsx', c, 'utf8');
console.log('Step 1 complete — state + helpers injected');
