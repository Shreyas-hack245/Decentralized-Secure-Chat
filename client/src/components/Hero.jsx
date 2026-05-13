import { useState } from "react";

function Hero({ connectWallet }) {
  const [isLocked, setIsLocked] = useState(true);

  const handleLockClick = () => {
    setIsLocked(!isLocked);
    // Add a small delay then "re-lock" for effect or just leave it
    if (isLocked) {
      setTimeout(() => {
        // Maybe trigger something cool here
      }, 1000);
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="badge">New: AES-256 Protocol v2.0</div>
        <h1 className="title">
          Privacy is not a <span className="highlight">Privilege</span>, it's a <span className="highlight">Right</span>.
        </h1>
        <p className="subtitle">
          Experience the next generation of decentralized messaging. No trackers, no central servers, just pure privacy.
        </p>
        <div className="hero-btns">
          <button className="connect-btn" onClick={connectWallet}>
            Get Started for Free
          </button>
          <button className="secondary-btn">
            Read Whitepaper
          </button>
        </div>
      </div>
      <div className="hero-visual" onClick={handleLockClick} style={{ cursor: 'pointer' }}>
        <div className={`floating-lock ${!isLocked ? 'unlocked' : ''}`}>
          {isLocked ? '🔐' : '🔓'}
        </div>
        {!isLocked && <div className="unlock-ripple"></div>}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        {!isLocked && <div className="security-status">System Verified</div>}
      </div>
    </section>
  );
}

export default Hero;
