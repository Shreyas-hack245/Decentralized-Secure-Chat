function Partners() {
  const partners = [
    { name: "ChainSafe", icon: "🌐" },
    { name: "IPFS", icon: "📦" },
    { name: "Ethereum", icon: "💎" },
    { name: "Polygon", icon: "🟣" },
    { name: "Web3Auth", icon: "🔑" }
  ];

  return (
    <div className="partners-section">
      <div className="partners-slider">
        {partners.map((partner, index) => (
          <div key={index} className="partner-logo">
            <span className="partner-icon">{partner.icon}</span>
            <span className="partner-name">{partner.name}</span>
          </div>
        ))}
        {/* Duplicate for seamless scroll */}
        {partners.map((partner, index) => (
          <div key={index + partners.length} className="partner-logo">
            <span className="partner-icon">{partner.icon}</span>
            <span className="partner-name">{partner.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Partners;
