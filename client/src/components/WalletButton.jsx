import { useState } from "react";

function WalletButton() {

  const [account, setAccount] = useState("");

  async function connectWallet() {

    if (window.ethereum) {

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);

    } else {
      alert("Install MetaMask");
    }
  }

  return (
    <div>

      <button
        className="connect-btn"
        onClick={connectWallet}
      >
        {account
          ? account.slice(0, 6) + "..." + account.slice(-4)
          : "Connect Wallet"}
      </button>

    </div>
  );
}

export default WalletButton;