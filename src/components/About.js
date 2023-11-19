import React from "react";
import MainImage from "../assets/success.svg";
import "./About.css"
function About() {
  return (
    <div className="main-content">
      <div className="main-img">
        <img src={MainImage} alt="MainImage" />
      </div>
      <div className="main-text">
        <p className="header">
          Manage your Projects easily with <p>ProTool.</p>
        </p>
        <p className="sub-header">
          Simplify project management with our platform. Effortlessly manage
          projects, collaborate with your team, track progress and stay
          organized all in one place. Experience productivity like never before.
        </p>
        
      </div>
    </div>
  );
}

export default About;
