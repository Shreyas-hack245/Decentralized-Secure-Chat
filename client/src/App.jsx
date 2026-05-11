import "./App.css";

import { useState } from "react";

import Navbar from "./components/Navbar";

import Hero from "./components/Hero";

import Features from "./components/Features";

import Chat from "./components/Chat";

import Background from "./components/Background";

function App() {

  const [walletConnected,
    setWalletConnected] =
    useState(false);

  function connectWallet() {

    setWalletConnected(true);
  }

  return (

    <div>

      <Background />

      <Navbar />

      {

        !walletConnected ? (

          <>

            <Hero
              connectWallet={
                connectWallet
              }
            />

            <Features />

          </>

        ) : (

          <Chat />

        )

      }

    </div>

  );
}

export default App;