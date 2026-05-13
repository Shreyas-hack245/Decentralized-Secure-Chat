function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2 className="highlight">🔐 SecureChat</h2>
          <p>Protecting global communications through decentralization and advanced encryption.</p>
          <div className="social-links">
            <a href="#" title="X (Twitter)">𝕏</a>
            <a href="#" title="Discord">💬</a>
            <a href="#" title="GitHub">💻</a>
            <a href="#" title="Telegram">✈️</a>
          </div>
        </div>
        
        <div className="footer-links">
          <div className="link-group">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#security">Security Protocol</a>
            <a href="#node">Node Network</a>
            <a href="#token">Tokenomics</a>
          </div>
          <div className="link-group">
            <h4>Resources</h4>
            <a href="#">Whitepaper</a>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">Security Audit</a>
          </div>
          <div className="link-group">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
            <a href="#">Blog</a>
          </div>
          <div className="link-group">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} SecureChat Protocol. Built for the Decentralized Web.</p>
          <div className="status-indicator">
            <span className="dot"></span>
            All Nodes Operational
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

