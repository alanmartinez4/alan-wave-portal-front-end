import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
    /*
    * Just a state variable we use to store our user's public wallet
    */
    const[currentAccount, setCurrentAccount] = useState("");
    const [allWaves, setAllWaves] = useState([]);
    const [totalWaves, setTotalWaves] = React.useState("");
    
    /*
    * Create a variable here that holds the contract address affter you deploy
    */
    const contractAddress = "0xdC030DaEE364219e9c346B2d863f6B0F97AA2B6D";

   /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await waveportalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

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
          getAllWaves()
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
      <label className="label">Send a message along with the wave</label>
      <input type="text" id="msg" name="msg">
      </input>
      {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App
