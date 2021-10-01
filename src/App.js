import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
    /*
    * Just a state variable we use to store our user's public wallet
    */
    const[currentAccount, setCurrentAccount] = useState("");
    const [totalWaves, setTotalWaves] = React.useState("");
    
    /*
    * Create a variable here that holds the contract address affter you deploy
    */
    const contractAddress = "0x3aEA2454539Bf00D1C71D09d10C2C4B55049FBE3";

    /*
    * Create a variable here that references the abi content
    */
    const contractABI = abi.abi;

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

const wave = async () => {
  try {
    const { ethereum } = window;

    if(ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum); // ethers is a library that helps our frontend talk to our contract.
      const signer = provider.getSigner(); // a provider is what we use to actually talk to Ethereum nodes.

      // You're using contractABI here
      const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let count = await waveportalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());

      // update totalWaves to display
      setTotalWaves(count.toNumber())

      const waveTxn = await waveportalContract.wave();
      console.log("Mining...", waveTxn.hash);

      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);

      count = await waveportalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());

      setTotalWaves(count.toNumber())
    } else {
        console.log("Ethereum object doesn't exist!");
    } 
  } catch (error) {
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

        <div className="bio">
          Total Number of Waves is:  {totalWaves}
        </div>

        <button className="waveButton" onClick={wave}>
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