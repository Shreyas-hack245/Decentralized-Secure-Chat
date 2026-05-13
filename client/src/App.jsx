import "./App.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Chat from "./components/Chat";
import Background from "./components/Background";
import Stats from "./components/Stats";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

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
          <div id="features">
            <Features />
          </div>
          <div id="stats">
            <Stats />
          </div>
          <div id="faq">
            <FAQ />
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