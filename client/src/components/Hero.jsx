import { useState, useEffect } from "react";

function Hero({ connectWallet }) {
  const [terminalLines, setTerminalLines] = useState([
    "[SYS] Initializing SecureChat Protocol v2.0...",
  ]);
  const [showArch, setShowArch] = useState(false);

  useEffect(() => {
    const lines = [
      "[SYS] Initializing SecureChat Protocol v2.0...",
      "[AUTH] Generating Zero-Knowledge Proofs...",
      "[NODE] Connecting to Global P2P Cluster...",
      "[NET] Synchronizing Lattice Cryptography Keys...",
      "[OK] Secure Environment Verified."
    ];
    let i = 1;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setTerminalLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-center">
      <div className="hero-grid-bg"></div>
      
      <div className="hero-center-content">
        <div className="hero-badge">
          <span className="pulse-mini-accent"></span>
          Decentralized Protocol v2.0
        </div>
        
        <h1 className="hero-massive-title">
          UNCOMPROMISED <span className="text-gradient">SECURITY</span>.<br />
          BORDERLESS <span className="text-gradient">COMMUNICATION</span>.
        </h1>
        
        <p className="hero-center-subtitle">
          Engineered for absolute confidentiality. Communicate seamlessly across a distributed node architecture with zero trust required and zero metadata retained.
        </p>
        
        <div className="hero-terminal">
          <div className="terminal-header">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="terminal-title">node-connection.sh</span>
          </div>
          <div className="terminal-body">
            {terminalLines.map((line, idx) => (
              <div key={idx} className="terminal-line">
                <span className="prompt">~ $</span> {line}
              </div>
            ))}
            {terminalLines.length < 5 && <div className="terminal-cursor">_</div>}
          </div>
        </div>

        <div className="hero-center-actions">
          <button className="glow-btn-primary" onClick={connectWallet}>
            Initialize Secure Node
          </button>
          <button className="glow-btn-secondary" onClick={() => setShowArch(true)}>
            View Architecture
          </button>
        </div>
      </div>

      {showArch && (
        <div className="arch-modal-overlay" onClick={() => setShowArch(false)}>
          <div className="arch-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowArch(false)}>✕</button>
            <h2>Decentralized Architecture</h2>
            <div className="arch-diagram">
              <div className="arch-node">Client App<br/><span>AES-256 E2EE</span></div>
              <div className="arch-arrow">↔</div>
              <div className="arch-node center">Relay Node<br/><span>Zero-Knowledge</span></div>
              <div className="arch-arrow">↔</div>
              <div className="arch-node">Peer Client<br/><span>Local Decrypt</span></div>
            </div>
            <div className="arch-details">
              <div className="detail-item">
                <span className="icon">🔒</span>
                <div>
                  <h4>Zero Trust</h4>
                  <p>Nodes route packets but cannot decrypt payloads or retain metadata.</p>
                </div>
              </div>
              <div className="detail-item">
                <span className="icon">⚡</span>
                <div>
                  <h4>Low Latency</h4>
                  <p>Direct socket connections ensure real-time, peer-to-peer delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;


