import "./App.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Chat from "./components/Chat";
import Background from "./components/Background";
import Footer from "./components/Footer";
import Roadmap from "./components/Roadmap";
import EncryptionStream from "./components/EncryptionStream";

function App() {
  const [walletConnected, setWalletConnected] = useState(false);

  function connectWallet() {
    setWalletConnected(true);
  }

  function disconnectWallet() {
    setWalletConnected(false);
  }

  return (
    <div className="app-container">
      <Background />
      <Navbar 
        walletConnected={walletConnected} 
        connectWallet={connectWallet} 
        disconnectWallet={disconnectWallet}
      />

      {!walletConnected ? (
        <>
          <Hero connectWallet={connectWallet} />
          <EncryptionStream />
          <div id="roadmap">
            <Roadmap />
          </div>
          <Footer />
        </>
      ) : (
        <Chat disconnectWallet={disconnectWallet} />
      )}
    </div>
  );
}

export default App;

