import React, { useEffect } from "react";
import { ethers } from "ethers";
import './App.css';


const App = () => {
  const checkIfWalletIsConnected = () => {
    /*
    * First make we we have access to window.ethereum
    */
    const { ethereum } = window;

    if(!ethereum){
      console.log("Make sure you have metamask!");
      return;
    } else{
      console.log("We have an ethereum object", ethereum)
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
      </div>
    </div>
  );
}

export default App