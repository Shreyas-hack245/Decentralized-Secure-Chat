import { useState } from "react";

function Hero({ connectWallet }) {
  const [isLocked, setIsLocked] = useState(true);

  const features = [
    { title: "Zero-Knowledge", icon: "🛡️", desc: "Provable Data Secrecy" },
    { title: "Quantum-Resistant", icon: "🌐", desc: "Lattice Cryptography" },
    { title: "Peer-to-Peer", icon: "⚡", desc: "Distributed Consensus" }
  ];

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="badge">
          <span className="pulse-mini"></span>
          Decentralized Protocol v2.0
        </div>
        <h1 className="title">
          Uncompromised <span className="highlight">Security</span>.<br/>Borderless <span className="highlight">Communication</span>.
        </h1>
        <p className="subtitle">
          Engineered for absolute confidentiality. Communicate seamlessly across a distributed node architecture with zero trust required and zero metadata retained.
        </p>
        
        <div className="hero-btns">
          <button className="connect-btn" onClick={connectWallet}>
            Initialize Secure Node
          </button>
          <button className="secondary-btn">
            View Architecture
          </button>
        </div>

        <div className="hero-features-grid">
          {features.map((f, i) => (
            <div key={i} className="hero-feature-pill" style={{animationDelay: `${i * 0.1}s`}}>
              <span className="f-icon">{f.icon}</span>
              <div className="f-text">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-visual" onClick={() => setIsLocked(!isLocked)} style={{ cursor: 'pointer' }}>
        <div className={`floating-lock ${!isLocked ? 'unlocked' : ''}`}>
          {isLocked ? '🔐' : '🔓'}
        </div>
        {!isLocked && <div className="unlock-ripple"></div>}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className={`security-status-indicator ${!isLocked ? 'verified' : ''}`}>
           {isLocked ? '🔒 Secure Environment' : '✅ Identity Verified'}
        </div>
      </div>
    </section>
  );
}

export default Hero;


