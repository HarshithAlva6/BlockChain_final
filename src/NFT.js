import React, { useEffect, useState } from 'react';

function NFT({ Market, userAccount, alertPlaceholder }) {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    getAllNft();
  }, []); // Run once when component mounts

  const getAllNft = async () => {
    const lastListingId = parseInt(sessionStorage.getItem("lastListingId")) || 0;
    const status = ["Active", "Sold", "Cancelled"];
    const bkgStatus = ["success", "secondary", "danger"];
    const temp = [".row1", ".row2", ".row3", ".row4"];
    let j = -1;

    for (let i = 0; i < lastListingId; i++) {
      if (i % 3 === 0) {
        j++;
      }
      
      try {
        const val = await Market.methods.getListing(i + 1).call();
        console.log(val);
        let button;
        
        if (status[parseInt(val.status)] !== "Sold") {
          button = (
            <button 
              type="submit" 
              className="d-block w-100 mt-3 btn btn-primary buyNft" 
              onClick={() => buyNft(i + 1, val.price)}
            >
              Buy
            </button>
          );
        } else {
          button = (
            <button 
              type="submit" 
              className="d-block w-100 mt-3 btn btn-secondary" 
              disabled
            >
              Buy
            </button>
          );
        }

        setListings(prevListings => [...prevListings, (
          <div className="col-md-4" key={i}>
            <div className="card m-3" style={{ width: "15rem" }}>
              <img src="https://cdn.dribbble.com/users/5180/screenshots/13951298/media/194e6228d7477efddad399ce9ef8b063.png?compress=1&resize=400x300&vertical=top" className="card-img-top" alt="ABC" height="110px" />
              <div className="card-body">
                <h5 className="card-title mb-3" id="card-title">ABC Token #{val.tokenId}</h5>
                <p className="card-text text-nowrap text-secondary" id="seller">
                  <i className="bi bi-person-fill me-2"></i> {val.seller}
                </p>
                <p className="card-text text-secondary">
                  <i className="bi bi-tag-fill me-2"></i> {val.price} Wei
                </p>
                <span className={`fw-normal badge text-bg-${bkgStatus[parseInt(val.status)]}`}>
                  {status[parseInt(val.status)]}
                </span>
                {button}
              </div>
            </div>
          </div>
        )]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const buyNft = (listingID, price) => {
    Market.methods
      .buyToken(listingID)
      .send({ from: userAccount, value: price })
      .on("receipt", function (receipt) {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
          <div class="alert alert-success alert-dismissible" role="alert">
            <div>You successfully Buy nft</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        alertPlaceholder.append(wrapper);
        window.location.reload(); // Reload page after buying
      })
      .on("error", function (error) {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
          <div class="alert alert-danger alert-dismissible" role="alert">
            <div>Sorry! It's unsuccessful to buy NFT</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        alertPlaceholder.append(wrapper);
        console.error(error);
      });
  };

  return (
    <div className="container">
      <div className="row">
        {listings}
      </div>
    </div>
  );
}

export default NFT;
