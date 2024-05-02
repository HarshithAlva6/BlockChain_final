import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import Navi from './Navi';
import './App.css'; // Import your CSS file here
import ballotAbi from './abi/ballotAbi.json';
import nftAbi from './abi/nftAbi.json';
import marketAbi from './abi/marketAbi.json';
import Web3 from 'web3';

function Voter() {
    const location = useLocation();
    var alertPlaceholder = document.getElementById("txStatus");
    var ballotAddress = "0x379C7e638659CccdD1e94d2021677561a3A7b521";
    var nftAddress = "0xe6e8bFD371b2E8f0FF31D841e49C2CDDca138183";
    var marketAddress = "0xfd44ad99dE18637313B15F9434f5eB600a9965C9";
    const { userAdd, userBal } = location.state;
    const web3 = new Web3('HTTP://127.0.0.1:7545');
    var NFT = new web3.eth.Contract(nftAbi, nftAddress);
    var Market = new web3.eth.Contract(marketAbi, marketAddress);
    var Ballot = new web3.eth.Contract(ballotAbi, ballotAddress);
    
    const giveRight = async () => {
        try {
          const receipt = await Ballot.methods.giveRightToVote(userAdd).send({ from: userAdd });
          const wrapper = document.createElement("div");
          wrapper.innerHTML = [
            `<div class="alert alert-success alert-dismissible" role="alert">`,
            `   <div>You are now eligible for voting</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            "</div>",
          ].join("");
          alertPlaceholder.append(wrapper);
          console.log("success");
        } catch (error) {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = [
            `<div class="alert alert-danger alert-dismissible" role="alert">`,
            `   <div>Sorry something wrong happen</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            "</div>",
          ].join("");
          alertPlaceholder.append(wrapper);
          console.log(error);
        }
    };

    const vote = (index) => {
        Ballot.methods
          .vote(index)
          .send({ from: userAdd })
          .on("receipt", function (receipt) {
            console.log("oh");
            const wrapper = document.createElement("div");
            wrapper.innerHTML = [
              `<div class="alert alert-success alert-dismissible" role="alert">`,
              `   <div>Congratulations!! you have successfully voted.</div>`,
              '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
              "</div>",
            ].join("");
            alertPlaceholder.append(wrapper);
            console.log("success");
          })
          .on("error", function (error) {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = [
              `<div class="alert alert-danger alert-dismissible" role="alert">`,
              `   <div>Sorry!! Something wrong happened</div>`,
              '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
              "</div>",
            ].join("");
            alertPlaceholder.append(wrapper);
            console.log(error);
          });
      };

      const delegateVote = (address) => {
        Ballot.methods
          .delegate(address)
          .send({ from: userAdd })
          .on("receipt", function (receipt) {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = [
              `<div class="alert alert-success alert-dismissible" role="alert">`,
              `   <div>Congratulations!! you have successfully delegate your right to ${address}.</div>`,
              '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
              "</div>",
            ].join("");
            alertPlaceholder.append(wrapper);
            console.log("success");
          })
          .on("error", function (error) {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = [
              `<div class="alert alert-danger alert-dismissible" role="alert">`,
              `   <div>Sorry!! Something wrong happen</div>`,
              '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
              "</div>",
            ].join("");
      
            alertPlaceholder.append(wrapper);
            console.log(error);
          });
      };

    const handleSummary = () => {
        Ballot.methods
          .summaryOfVotes()
          .call()
          .then(function (value) {
            var temp = [".votes1", ".votes2", ".votes3", ".votes4"];
            var i = 0;
            value.forEach(function (val) {
              document.querySelector(temp[i]).innerHTML = `<p>${val.voteCount}</p>`;
              i++;
            });
            document.querySelector("#exampleModal").modal("show");
          });
      };
    
      const handleVote = () => {
        const radios = document.getElementsByName("flexRadioDefault");
        for (let i = 0, length = radios.length; i < length; i++) {
          if (radios[i].checked) {
            vote(radios[i].value);
            break;
          }
        }
      };
    
      const handleDelegate = () => {
        delegateVote(document.querySelector("#delegateId").value);
      };

  return (
    <div>
      <Navi />
        {/* alert section */}
        <div id="txStatus"></div>
    <div className="votingSection" id="section">
      <div className="listSection">
        <div className="form-check mt-3">
          <input
            className="form-check-input mt-3"
            type="radio"
            name="flexRadioDefault"
            value="0"
            id="dhyey"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/U%2B217E.svg/1200px-U%2B217E.svg.png"
            alt="d"
            className="rounded-circle logo border border-ligh"
          />
          <label className="form-check-label ms-3" htmlFor="dhyey">Dhyey </label>
        </div>
        <div className="form-check mt-3">
          <input
            className="form-check-input mt-3"
            type="radio"
            name="flexRadioDefault"
            value="1"
            id="fenil"
          />
          <img
            src="https://www.funnycoloringpages.com/uploads/kleurplaten/letter-f.jpg"
            alt="f"
            className="rounded-circle logo border border-ligh"
          />
          <label className="form-check-label ms-3" htmlFor="fenil"> Fenil </label>
        </div>
        <div className="form-check mt-3">
          <input
            className="form-check-input mt-3"
            type="radio"
            name="flexRadioDefault"
            value="2"
            id="heet"
          />
          <img
            src="https://www.i2symbol.com/images/text-symbols/h-symbol.png"
            alt="h"
            className="rounded-circle logo border border-ligh"
          />
          <label className="form-check-label ms-3" htmlFor="heet"> Heet </label>
        </div>
        <div className="form-check mt-3">
          <input
            className="form-check-input mt-3"
            type="radio"
            name="flexRadioDefault"
            value="3"
            id="nota"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/NOTA_Option_Logo.svg/1200px-NOTA_Option_Logo.svg.png"
            alt="nota"
            className="rounded-circle logo border border-ligh"
          />
          <label className="form-check-label ms-3" htmlFor="nota"> NOTA </label>
        </div>
      </div>

      <button
        type="submit"
        id="giveRight"
        className="my-3 me-5 btn btn-outline-success"
        onClick={giveRight}
      >
        Give Me Right
      </button>

      <button type="submit" id="vote" className="me-5 btn btn-outline-warning" onClick={handleVote}>
        Vote
      </button>

      <button type="submit" id="summary" className="me-5 btn btn-outline-secondary" onClick={handleSummary}>
        Summary
      </button>
      <div className="summary"></div>

      {/* or section */}
      <hr className="hr-text" data-content="OR" />

      {/* delegate vote */}
      <div className="input-group mb-3 delegate mt-3">
        <input type="text" className="form-control" id="delegateId" />
        <button className="btn btn-outline-primary" type="submit" id="delegate" onClick = {handleDelegate}>
          Delegate
        </button>
      </div>
    </div>
    </div>
  );
}

export default Voter;
