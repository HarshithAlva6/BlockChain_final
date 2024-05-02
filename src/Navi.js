import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navi = () => {
  const location = useLocation();
  const { userAdd, userBal } = location.state;
  return (
    <div>
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">EVoting</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item px-1">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item px-1">
              <Link className="nav-link text-muted" to="./candidates">Candidates</Link>
            </li>
            <li className="nav-item px-1">
              <Link className="nav-link text-muted" to="/nft">NFT</Link>
            </li>
          </ul>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav">
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Your Profile
          </a>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#" id="adminAddress"><i className="bi bi-person-fill me-1"></i>{userAdd}</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#" id="adminBalance"><i className="bi bi-currency-dollar me-1"></i>{userBal} Ether</a></li>
          </ul>
        </li>
      </ul>
    </div>
        </div>
      </div>
    </nav>
    </div>
  );
};   
export default Navi;
