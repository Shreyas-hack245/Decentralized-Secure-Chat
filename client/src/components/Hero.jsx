import { useState } from "react";

function Hero({ connectWallet }) {
  const [isLocked, setIsLocked] = useState(true);

  const features = [
    { title: "End-to-End", icon: "🔐", desc: "Military-grade AES-256" },
    { title: "Blockchain ID", icon: "🔗", desc: "Decentralized Auth" },
    { title: "Real-Time", icon: "⚡", desc: "Zero-latency Sync" }
  ];

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="badge">
          <span className="pulse-mini"></span>
          Decentralized Protocol v2.0
        </div>
        <h1 className="title">
          Privacy is not a <span className="highlight">Privilege</span>, it's a <span className="highlight">Right</span>.
        </h1>
        <p className="subtitle">
          Experience the next generation of decentralized messaging. No trackers, no central servers, just <span style={{color: 'var(--accent-color)', fontWeight: '600'}}>absolute privacy</span>.
        </p>
        
        <div className="hero-btns">
          <button className="connect-btn" onClick={connectWallet}>
            Get Started Now
          </button>
          <button className="secondary-btn">
            Whitepaper
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


