function Stats() {
  const stats = [
    { label: "Total Messages", value: "1.2M+" },
    { label: "Active Nodes", value: "4,500+" },
    { label: "Uptime", value: "99.99%" },
    { label: "Encryption", value: "AES-256" }
  ];

  return (
    <div className="stats-section">
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;