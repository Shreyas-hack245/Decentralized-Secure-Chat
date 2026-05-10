import WalletButton from "./WalletButton";

function Hero() {
  return (
    <div className="hero">

      <h1 className="title">
        Decentralized Secure Chat
      </h1>

      <p className="subtitle">
        End-to-End Encrypted Blockchain Messaging
      </p>

      <WalletButton />

    </div>
  );
}

export default Hero;