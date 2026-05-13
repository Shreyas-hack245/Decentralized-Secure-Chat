function Navbar({ walletConnected, connectWallet, disconnectWallet }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span style={{ marginRight: '8px' }}>🔐</span>SecureChat
      </div>
      <div className="navbar-links">
        <a href="#features">Features</a>
        <a href="#stats">Stats</a>
        <a href="#faq">FAQ</a>
      </div>
      <div className="navbar-actions">
        {!walletConnected ? (
          <button className="nav-connect-btn" onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <button className="nav-disconnect-btn" onClick={disconnectWallet}>Disconnect</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;