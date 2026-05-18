import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('./Chat.jsx', 'utf8');

// ── JSX UPDATES ─────────────────────────────────────────────────────────────

// A. Message search bar in header + search/pin icon
c = c.replace(
  `<button className="icon-btn" title="Video Call" onClick={() => startCall('Video Call')}><Ic.Video /></button>
            <button className="icon-btn" title="Voice Call" onClick={() => startCall('Voice Call')}><Ic.Phone /></button>`,
  `<button className="icon-btn" title="Search Messages" onClick={() => { setShowSearchBar(!showSearchBar); setSearchInChat(''); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
            <button className="icon-btn" title="Video Call" onClick={() => startCall('Video Call')}><Ic.Video /></button>
            <button className="icon-btn" title="Voice Call" onClick={() => startCall('Voice Call')}><Ic.Phone /></button>`
);

// B. Pinned message bar (after the chat-main-header div closes)
const pinnedBar = `
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
        )}`;
c = c.replace(
  `        <div className="messages-area whatsapp-bg">`,
  pinnedBar + `\n        <div className="messages-area whatsapp-bg">`
);

// C. Update message map to filter by search + mark starred + show reply snippet
const oldMsgMap = `          {messages.map((msg, index) => (
            <div key={index} className={\`message-group \${msg.type}\`}>`;
const newMsgMap = `          {messages.filter(msg => {
              if (!searchInChat) return true;
              try { return CryptoJS.AES.decrypt(msg.text, SECRET_KEY).toString(CryptoJS.enc.Utf8).toLowerCase().includes(searchInChat.toLowerCase()); } catch(e) { return false; }
            }).map((msg, index) => (
            <div key={index} className={\`message-group \${msg.type} \${starredMsgs.has(activeChatId+'-'+index) ? 'starred-msg' : ''}\`}>`;
c = c.replace(oldMsgMap, newMsgMap);

// D. Update message context menu - add Reply, Star, Pin, Forward
c = c.replace(
  `                      <div className="msg-menu-item" style={{display:'flex',alignItems:'center',gap:'0.5rem'}} onClick={() => { 
                          try {
                              const dec = CryptoJS.AES.decrypt(msg.text, SECRET_KEY).toString(CryptoJS.enc.Utf8);
                              navigator.clipboard.writeText(dec); 
                              showToast("Copied to clipboard", "success");
                          } catch(e){}
                          setActiveMsgMenu(null); 
                      }}><Ic.Copy s={13}/> Copy Text</div>
                      <div className="msg-menu-item danger" style={{display:'flex',alignItems:'center',gap:'0.5rem'}} onClick={() => deleteMessage(index)}><Ic.Trash s={13}/> Delete Message</div>`,
  `                      <div className="msg-menu-item" style={{display:'flex',alignItems:'center',gap:'0.5rem'}} onClick={() => replyMessage(msg, index)}>
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
                      <div className="msg-menu-item danger" style={{display:'flex',alignItems:'center',gap:'0.5rem'}} onClick={() => deleteMessage(index)}><Ic.Trash s={13}/> Delete</div>`
);

// E. Add reply preview above message + reactions row below message + reaction picker trigger
// Find message-content div and add reply preview inside
c = c.replace(
  `                <div className="message-content">
                  {(() => {`,
  `                {msg.replyRef && (
                    <div className="reply-snippet">
                      <span className="reply-user">{msg.replyRef.username}</span>
                      <span className="reply-text">{msg.replyRef.text}</span>
                    </div>
                  )}
                <div className="message-content">
                  {(() => {`
);

// Add reactions row + reaction trigger after message-footer
c = c.replace(
  `              </div>
            </div>
          ))}
        </div>

        <div className="message-input-area">`,
  `              {messageReactions[activeChatId+'-'+index]?.length > 0 && (
                  <div className="reactions-row">
                    {messageReactions[activeChatId+'-'+index].map((r,ri) => (
                      <span key={ri} className={\`reaction-chip \${r.mine ? 'mine' : ''}\`} onClick={() => toggleReaction(index, r.emoji)}>
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

        <div className="message-input-area">`
);

// F. Reply bar above input
const replyBar = `
          {replyTo && (
            <div className="reply-bar">
              <div className="reply-bar-content">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                <span className="reply-bar-user">{replyTo.username}</span>
                <span className="reply-bar-text">{replyTo.text}{replyTo.text.length >= 60 ? '...' : ''}</span>
              </div>
              <button onClick={() => setReplyTo(null)}><Ic.X s={14}/></button>
            </div>
          )}`;
c = c.replace(
  `        <div className="message-input-area">
          <div className="input-actions">`,
  `        <div className="message-input-area">` + replyBar + `
          <div className="input-actions">`
);

// G. Attach replyRef to sent messages  
c = c.replace(
  `    const messageData = {
      username,
      text: encryptedMessage,
      type: "sent",
      chatId: activeChatId,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };`,
  `    const messageData = {
      username,
      text: encryptedMessage,
      type: "sent",
      chatId: activeChatId,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      replyRef: replyTo ? { username: replyTo.username, text: replyTo.text } : null,
    };`
);
c = c.replace(
  `    setMessage("");
    socket.emit("stop_typing", { username, chat: activeChatId });`,
  `    setMessage("");
    setReplyTo(null);
    socket.emit("stop_typing", { username, chat: activeChatId });`
);

// H. Add mic/voice button next to send
c = c.replace(
  `          <button 
            className={\`send-btn \${(message.trim() && !isBlocked) ? 'active' : ''}\`} 
            onClick={sendMessage}
            disabled={isBlocked}
          >
            <Ic.Send s={17}/>
          </button>`,
  `          {!message.trim() && !isBlocked && (
            <button className={\`mic-btn \${isRecording ? 'recording' : ''}\`} onClick={startVoiceNote} title={isRecording ? 'Stop recording' : 'Voice note'}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill={isRecording ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </button>
          )}
          {(message.trim() || isBlocked) && (
            <button 
              className={\`send-btn \${(message.trim() && !isBlocked) ? 'active' : ''}\`} 
              onClick={sendMessage}
              disabled={isBlocked}
            >
              <Ic.Send s={17}/>
            </button>
          )}`
);

// I. Forward modal
const forwardModal = `
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
      )}`;
c = c.replace(
  `      {showNewChatModal && (`,
  forwardModal + `\n      {showNewChatModal && (`
);

// J. Online dot on chat items in sidebar
c = c.replace(
  `                    <div className="chat-avatar">{chat.name?.[0]}</div>`,
  `                    <div className="chat-avatar" style={{position:'relative'}}>
                      {chat.name?.[0]}
                      <span className="online-dot" style={{background: chat.id === 'global' || chat.id === '1' ? '#27c93f' : '#888'}}></span>
                    </div>`
);

// K. Voice note rendering in message bubble
c = c.replace(
  `                      return <p className="message-text">{decrypted}</p>;`,
  `                      if (decrypted.startsWith('[VOICE:')) {
                        const match = decrypted.match(/\\[VOICE:(\\d+):(\\d+)\\]/);
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
                      return <p className="message-text">{decrypted}</p>;`
);

writeFileSync('./Chat.jsx', c, 'utf8');
console.log('Step 2 complete — JSX updated!');
