function Roadmap() {
  const steps = [
    { phase: "Phase 1", title: "Protocol Launch", description: "Deployment of AES-256 E2EE core and decentralized identity layer.", status: "completed" },
    { phase: "Phase 2", title: "Multi-Platform Support", description: "Mobile apps for iOS and Android with biometric security.", status: "current" },
    { phase: "Phase 3", title: "Group Governance", description: "Decentralized autonomous groups with voting and roles.", status: "upcoming" }
  ];


  return (
    <div className="roadmap-section">
      <h2 className="section-title">Project Roadmap</h2>
      <div className="roadmap-container">
        {steps.map((step, index) => (
          <div key={index} className={`roadmap-item ${step.status}`}>
            <div className="roadmap-marker"></div>
            <div className="roadmap-content">
              <span className="roadmap-phase">{step.phase}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Roadmap;
