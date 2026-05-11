function Hero({ connectWallet }) {

  return (

    <section className="hero">

      <h1 className="title">
        Decentralized Secure Chat
      </h1>

      <p className="subtitle">

        End-to-End Encrypted Blockchain Messaging

      </p>

      <button
        className="connect-btn"
        onClick={connectWallet}
      >

        Connect Wallet

      </button>

    </section>

  );
}

export default Hero;