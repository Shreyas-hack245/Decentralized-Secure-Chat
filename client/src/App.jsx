import "./App.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Chat from "./components/Chat";
import Background from "./components/Background";
import Footer from "./components/Footer";
import EncryptionStream from "./components/EncryptionStream";
import Features from "./components/Features";
import Stats from "./components/Stats";
import FAQ from "./components/FAQ";

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
      
      {!walletConnected ? (
        <>
          <Navbar 
            walletConnected={walletConnected} 
            connectWallet={connectWallet} 
            disconnectWallet={disconnectWallet}
          />
          <Hero connectWallet={connectWallet} />
          <Features />
          <Stats />
          <EncryptionStream />
          <FAQ />
          <Footer />
        </>
      ) : (
        <Chat disconnectWallet={disconnectWallet} />
      )}
    </div>
  );
}

export default App;

