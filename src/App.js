import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

const App = () => {
    /*
    * Just a state variable we use to store our user's public wallet
    */
    const[currentAccount, setCurrentAccount] = useState("");

    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;

        if(!ethereum) {
          console.log("Make sure you have metamask!");
          return;
        } else {
          console.log("We have an ethereum object", ethereum)
        }
        
        /*
        * Check if we're authorized to access the user's wallet
        */
        const accounts = await ethereum.request({ method: 'eth_accounts'});

        if(accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account.", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found.");
        }
      } catch (error){
        console.log(error);
      }
  }

/*
* Implment your connectWallet method here.
*/
const connectWallet = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }

    const accounts = await ethereum.request({method: "eth_requestAccounts"});

    console.log("Connected", accounts[0]);
    setCurrentAccount(accounts[0]);
  } catch(error) {
    console.log(error);
  }
}

/*
* This runs our function when the page loads.
*/
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am alan and I am learning how to create and deploy a smart contract to an Ethereum network, pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>
        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      {/*
      * If there is no currentAccount render this button
      */}
      {!currentAccount && (
        <button className="waveButton" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      </div>
    </div>
  );
}

export default App