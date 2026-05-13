function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>🔐 SecureChat</h2>
          <p>The future of private messaging is decentralized.</p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#security">Security</a>
            <a href="#roadmap">Roadmap</a>
          </div>
          <div className="link-group">
            <h4>Community</h4>
            <a href="#">Discord</a>
            <a href="#">Twitter</a>
            <a href="#">GitHub</a>
          </div>
          <div className="link-group">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 SecureChat. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
