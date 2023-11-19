import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import prologo from "../assets/slack.svg";
export const Navbar = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("PMTusername");
    navigate("/login");
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "transparent" }}
      >
        <div className="container-fluid">
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <Link
              className="navbar-brand"
              style={{ fontSize: "32px", fontWeight: "500" }}
              to="/"
            >
              <img
                src={prologo}
                alt="Prologo"
                style={{
                  marginRight: "10px",
                  width: "40px",
                }}
              />
              Protool
            </Link>
          </div>
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
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                  to="/about"
                >
                  About
                </Link>
              </li>
            </ul>
            {!localStorage.getItem("token") ? (
              <form className="d-flex" role="search">
                <Link
                  className="btn btn-primary mx-1"
                  to="/login"
                  role="button"
                >
                  Login
                </Link>
                <Link
                  className="btn btn-primary mx-1"
                  to="/signup"
                  role="button"
                >
                  Signup
                </Link>
              </form>
            ) : (
              <>
                <span className="badge bg-dark">
                  {localStorage.getItem("PMTusername")}
                </span>
                <button onClick={handleLogout} className="btn btn-primary mx-1">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
