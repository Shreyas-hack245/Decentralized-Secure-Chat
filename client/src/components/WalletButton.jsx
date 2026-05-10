import { useState } from "react";

function WalletButton() {

  const [account, setAccount] = useState("");

  async function connectWallet() {

    try {

      if (!window.ethereum) {
        alert("MetaMask not detected");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);

    } catch (error) {

      console.log(error);

    }
  }

  return (

    <button
      className="connect-btn"
      onClick={connectWallet}
    >

      {
        account
          ? account.slice(0, 6) +
            "..." +
            account.slice(-4)
          : "Connect Wallet"
      }

    </button>

  );
}

export default WalletButton;