function Hero({ connectWallet }) {
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
      <div className="hero-visual">
        <div className="floating-lock">🔐</div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
    </section>
  );
}

export default Hero;