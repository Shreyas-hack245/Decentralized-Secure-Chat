import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('./Chat.jsx', 'utf8');

const AC = 'var(--accent-color)';

// Status list: ✨ Zap
c = c.replaceAll(
  `<div className="status-avatar update">\u2728</div>`,
  `<div className="status-avatar update" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"${AC}"}}><Ic.Zap s={22}/></div>`
);
// Status list: 🔐 Key
c = c.replaceAll(
  `<div className="status-avatar update">\uD83D\uDD10</div>`,
  `<div className="status-avatar update" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"${AC}"}}><Ic.Key s={22}/></div>`
);
// Status list: 🛡️ Shield
c = c.replaceAll(
  `<div className="status-avatar update">\uD83D\uDEE1\uFE0F</div>`,
  `<div className="status-avatar update" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"${AC}"}}><Ic.Shield s={22}/></div>`
);

// File icon 📄
c = c.replaceAll(
  `<div className="file-icon">\uD83D\uDCC4</div>`,
  `<div className="file-icon" style={{display:"flex",color:"${AC}"}}><Ic.File s={32}/></div>`
);
// Download ⬇️
c = c.replace(
  `<button className="file-download-btn" onClick={() => showToast("Decrypting file...", "info")}>\u2B07\uFE0F</button>`,
  `<button className="file-download-btn" onClick={() => showToast("Decrypting file...", "info")} style={{display:"flex",alignItems:"center",justifyContent:"center"}}><Ic.Download s={14}/></button>`
);

// Settings icons
c = c.replaceAll(
  `<span className="setting-icon">\uD83D\uDD14</span>`,
  `<span className="setting-icon" style={{display:"flex",color:"${AC}"}}><Ic.Bell s={17}/></span>`
);
c = c.replaceAll(
  `<span className="setting-icon">\uD83D\uDD12</span>`,
  `<span className="setting-icon" style={{display:"flex",color:"${AC}"}}><Ic.Lock s={17}/></span>`
);
c = c.replaceAll(
  `<span className="setting-icon">\uD83D\uDDD1\uFE0F</span>`,
  `<span className="setting-icon" style={{display:"flex",color:"${AC}"}}><Ic.Trash s={17}/></span>`
);
c = c.replaceAll(
  `<span className="setting-icon">\uD83C\uDF19</span>`,
  `<span className="setting-icon" style={{display:"flex",color:"${AC}"}}><Ic.Moon s={17}/></span>`
);
c = c.replaceAll(
  `<span className="setting-icon">\uD83C\uDFA8</span>`,
  `<span className="setting-icon" style={{display:"flex",color:"${AC}"}}><Ic.Palette s={17}/></span>`
);
c = c.replaceAll(
  `<span className="setting-icon">\uD83E\uDDF9</span>`,
  `<span className="setting-icon" style={{display:"flex",color:"${AC}"}}><Ic.Database s={17}/></span>`
);

// Media lock overlays 🔐
c = c.replaceAll(
  `<div className="lock-overlay">\uD83D\uDD10</div>`,
  `<div className="lock-overlay" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.4)"}}><Ic.Lock s={24}/></div>`
);

// Login page lock icons
c = c.replaceAll(
  `<div className="login-lock-icon">\uD83D\uDD10</div>`,
  `<div className="login-lock-icon" style={{display:"flex",justifyContent:"center",color:"${AC}"}}><Ic.Lock s={48}/></div>`
);

// AES notice in login
c = c.replaceAll(
  `\uD83D\uDD12 AES-256 Bit Encryption Active`,
  `AES-256 Bit Encryption Active`
);

writeFileSync('./Chat.jsx', c, 'utf8');
console.log('All remaining emojis replaced successfully!');
