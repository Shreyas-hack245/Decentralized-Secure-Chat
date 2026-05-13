function Features() {
  return (
    <div className="features">
      <div className="card">
        <div className="card-icon">🔐</div>
        <h2>End-to-End Encryption</h2>
        <p>Your messages are secured with AES-256 encryption, ensuring only you and your recipient can read them.</p>
      </div>

      <div className="card">
        <div className="card-icon">🔗</div>
        <h2>Blockchain Identity</h2>
        <p>Leverage decentralized authentication via Web3 wallets for a truly borderless and private experience.</p>
      </div>

      <div className="card">
        <div className="card-icon">⚡</div>
        <h2>Real-Time Privacy</h2>
        <p>Experience lightning-fast communication with instant delivery and zero metadata storage.</p>
      </div>
    </div>
  );
}

export default Features;