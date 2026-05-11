import "./App.css";

import Navbar from "./components/Navbar";

import Hero from "./components/Hero";

import Features from "./components/Features";

import Chat from "./components/Chat";

import Background from "./components/Background";

function App() {

  return (

    <div>

      <Background />

      <Navbar />

      <Hero />

      <Features />

      <Chat />

    </div>

  );
}

export default App;