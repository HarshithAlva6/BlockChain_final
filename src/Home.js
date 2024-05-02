import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import ballotAbi from './ballotAbi.json';
import Web3 from 'web3';

const Home = () => {
const [loginId, setLoginId] = useState('');
const [userAccount, setUserAccount] = useState();
const [userBalance, setUserBalance] = useState();
const navigate = useNavigate();
//var chairPerson;
//var lastTokenId;
//var lastListingId;
//   var name = document.querySelector("#name1");
var proposal_name = document.querySelector("#proposal_name");

useEffect(() => {
  const initializeWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Accounts now exposed
        const val = await window.web3.eth.getBalance(accounts[0]);
        const userAccountBalance = window.web3.utils.fromWei(val, "ether");
        console.log("User Account:", accounts[0]);
        console.log("User Account Balance:", userAccountBalance);
        setUserAccount(accounts[0]);
        setUserBalance(userAccountBalance);
      } catch (error) {
        // User denied account access...
        console.error("Error:", error);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      try {
        // Request account access
        const accounts = await window.web3.eth.requestAccounts();
        // Get account balance
        const val = await window.web3.eth.getBalance(accounts[0]);
        const userAccountBalance = window.web3.utils.fromWei(val, "ether");
        console.log("User Account:", accounts[0]);
        console.log("User Account Balance:", userAccountBalance);
        setUserAccount(accounts[0]);
        setUserBalance(userAccountBalance);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    // Non-dapp browsers...
    else {
      console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
  };

  initializeWeb3();
}, []);

    const handleSubmit = () => {
      let temp = "0x1f989354450427E8ea37238facf108Bcc597559F";
      if (loginId.toLowerCase() === temp.toLowerCase()) {
        navigate("/admin", { state: { 
          userAdd: temp,
          userBal: userBalance } });
      } else if (loginId.toLowerCase() === userAccount.toLowerCase()) { // Assuming userAccount is defined somewhere
        navigate("/voters", { state: { 
          userAdd: userAccount,
          userBal: userBalance } });
    };
  }
  return (
    <div className="login">
      <h1 className="text-center">E-Voting</h1>
      <div className="loginSection mt-5">
        <p className="bg-warning text-dark bg-opacity-25 px-2 py-1 border border-warning rounded">
          <i className="bi bi-info-circle pe-1"></i>
          Your login id will be your metamask address
        </p>
        <div className="input-group mb-3">
        <input
        type="text"
        id="loginId"
        value={loginId}
        onChange={(e) => setLoginId(e.target.value)}
      />
      <button
        className="btn btn-outline-dark"
        type="submit"
        onClick={handleSubmit}
      >
        Login
      </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

