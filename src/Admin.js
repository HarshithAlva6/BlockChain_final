import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';
import Navi from './Navi';
import './App.css'; // Import your CSS file here
import ballotAbi from './abi/ballotAbi.json';
import nftAbi from './abi/nftAbi.json';
import marketAbi from '.abi//marketAbi.json';
import Web3 from 'web3';

const Admin = () => {  
  const location = useLocation();
  var alertPlaceholder = document.getElementById("txStatus");
  var ballotAddress = "0xEc31D1ACE6A7F3C19847e0Ae3B4A1Fc0930D5b01";
  var nftAddress = "0xe6e8bFD371b2E8f0FF31D841e49C2CDDca138183";
  var marketAddress = "0xfd44ad99dE18637313B15F9434f5eB600a9965C9";
  const { userAdd, userBal } = location.state;
  const [alertMessage, setAlertMessage] = useState('');
  const [winnerData, setWinnerData] = useState(null);
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const web3 = new Web3('HTTP://127.0.0.1:7545');
  var NFT = new web3.eth.Contract(nftAbi, nftAddress);
  var Market = new web3.eth.Contract(marketAbi, marketAddress);
  var Ballot = new web3.eth.Contract(ballotAbi, ballotAddress);

  useEffect(() => {
    const endVote = sessionStorage.getItem("endVote");
    if (JSON.parse(sessionStorage.getItem("pause"))) {
        document.querySelector(".votingSection").style.display = "none";
        document.querySelector(".resultSection").style.display = "block";
        document.querySelector(".resultSection").innerHTML = `<p>Voting paused</p>`;
      } else if (JSON.parse(endVote)) {
        document.querySelector(".votingSection").style.display = "none";
        document.querySelector(".resultSection").style.display = "block";
        winner();
      }
  }, []);

      //enter value into your profile
      const handleEndVote = () => {
        sessionStorage.setItem("endVote", true);
        setAlertMessage("Voting is over. You can see winner name soon");
      };

      const handlePause = () => {
        setIsPaused(prevState => !prevState);
    
        const message = isPaused ? "Voting will continue" : "You successfully paused the voting";
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
          <div class="alert alert-success alert-dismissible" role="alert">
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        alertPlaceholder.append(wrapper);
      };
        
    
      const handleReset = () => {
        Ballot.methods
          .resetVoters()
          .send({ from: userAdd })
          .on("receipt", function (receipt) {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = [
              `<div class="alert alert-success alert-dismissible" role="alert">`,
              `   <div>You successfully reset voting</div>`,
              '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
              "</div>",
            ].join("");
      
            alertPlaceholder.append(wrapper);
          })
          .on("error", function (error) {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = [
              `<div class="alert alert-danger alert-dismissible" role="alert">`,
              `   <div>Sorry! Its unsuccessfull to reset voting</div>`,
              '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
              "</div>",
            ].join("");
      
            alertPlaceholder.append(wrapper);
            console.log(error);
          });
      };

      const mintNFT = async () => {
        try {
          const receipt = await NFT.methods.mint().send({ from: userAdd });
          console.log(receipt);
          const lastTokenId = receipt.events.Transfer.returnValues.tokenId;
          sessionStorage.setItem("lastTokenId", lastTokenId);
    
          const wrapper = document.createElement("div");
          wrapper.innerHTML = [
            `<div class="alert alert-success alert-dismissible" role="alert">`,
            `   <div>You successfully Mint NFT and tokenId is ${lastTokenId}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            "</div>",
          ].join("");
          alertPlaceholder.append(wrapper);
        } catch (error) {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = [
            `<div class="alert alert-danger alert-dismissible" role="alert">`,
            `   <div>Sorry! Its unsuccessfull to mint NFT</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            "</div>",
          ].join("");
          alertPlaceholder.append(wrapper);
          console.log(error);
        }
      };

  const handleListingNFT = () => {
    if (!tokenId || !price) {
      alert("Please enter token ID and price");
    } else {
      listingNFT(parseInt(tokenId), parseInt(price));
    }
  };


  const listingNFT = (tokenid, price) => {
    NFT.methods
      .approve(marketAddress, tokenid)
      .send({ from: userAdd })
      .on("receipt", function (receipt) {
        console.log(receipt);
        const wrapper = document.createElement("div");
        wrapper.innerHTML = [
          `<div class="alert alert-success alert-dismissible" role="alert">`,
          `   <div>You successfully approved NFT</div>`,
          '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
          "</div>",
        ].join("");
  
        alertPlaceholder.append(wrapper);
  
        // listing contract
        Market.methods
          .listToken(nftAddress, tokenid, price)
          .send({ from: userAdd })
          .on("receipt", function (receipt1) {
            console.log(receipt1.events.Listed.returnValues.listingId);
            const lastListingId = receipt1.events.Listed.returnValues.listingId;
            sessionStorage.setItem("lastListingId", lastListingId);
  
            const wrapper = document.createElement("div");
            wrapper.innerHTML = [
              `<div class="alert alert-success alert-dismissible" role="alert">`,
              `   <div>You successfully listed NFT</div>`,
              '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
              "</div>",
            ].join("");
  
            alertPlaceholder.append(wrapper);
            setTokenId('');
            setPrice('');
          })
          .on("error", function (error) {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = [
              `<div class="alert alert-danger alert-dismissible" role="alert">`,
              `   <div>Sorry! It's unsuccessful to list NFT</div>`,
              '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
              "</div>",
            ].join("");
  
            alertPlaceholder.append(wrapper);
            console.log(error);
          });
      })
      .on("error", function (error) {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = [
          `<div class="alert alert-danger alert-dismissible" role="alert">`,
          `   <div>Sorry! It's unsuccessful to approve NFT</div>`,
          '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
          "</div>",
        ].join("");
  
        alertPlaceholder.append(wrapper);
        console.log(error);
      });
    };

    function winner() {
      Ballot.methods
        .winnerName()
        .call()
        .then(function (value) {
          setWinnerData(value);
        })
        .catch(error => {
          console.error('Error fetching winner:', error);
        });
    }

  return (
    <>
      <Navi />
      {/* alert section */}
      <div id="txStatus"></div>

      {/* body */}
      <section id="adminSection">
        <h2 className="text-center">Hello! Admin</h2>
        <div className="action mt-5 ms-3">
          <button type="submit" id="endVote" className="me-4 btn btn-outline-danger" onClick={handleEndVote}>End Voting</button>
          <button
          type="submit"
          id="pause"
          value="pause"
          class="me-4 btn btn-outline-warning"
          onClick={handlePause}
        >{isPaused ? "Continue" : "Pause"}</button>
          <button type="button" id="reset" className="me-4 btn btn-outline-secondary" onClick={handleReset}>Reset</button>
        </div>
      </section>

      {/* hr section */}
      <hr className="hr-text" data-content="NFT Section" />

      {/* nft section */}
      <section id="nftSection">
        <button type="submit" id="mint" className="mx-auto btn btn-outline-primary" onClick={mintNFT}>Mint NFT</button>
        <div className="input-group my-3 mx-auto">
          <input
            type="number"
            className="form-control"
            placeholder="Token Id"
            id="tokenid"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            aria-describedby="button-addon2"
          />
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            aria-describedby="button-addon2"
          />
          <button className="btn btn-outline-secondary" type="button" id="listingNft" onClick={handleListingNFT}>Listing NFT</button>
        </div>
      </section>
      <div className="resultSection" style={{display: 'none'}}>
      <div className="confetti">
        <div className="confetti-piece"></div> 
      </div>
      <div className="content">
      {winnerData && (
        <div>
          <p>Winner name: {winnerData.name}</p>
          <p>Total votes: {winnerData.voteCount}</p>
        </div>
      )}
      </div>
      </div>  
    </>
  );
}

export default Admin;
