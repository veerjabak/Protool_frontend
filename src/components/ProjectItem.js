import React, { useState } from "react";

function ProjectItem(props) {
  const { project } = props;
  const date = new Date(project.date);

  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    border: "2px solid #4CAF50", // Green border
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    margin: "10px",
    padding: "15px",
    backgroundColor: hovered ? "#e0e0e0" : "#f5f5f5", // Change background color based on hover
    transition: "background-color 0.3s, transform 0.3s",
    cursor: "pointer",
    transform: hovered ? "scale(1.05)" : "scale(1)", // Apply scale transform on hover
  };

  const titleStyle = {
    fontSize: "1.2rem",
    marginBottom: "10px",
    textDecoration: "underline", // Underline for the project name
    color: "#333", // Dark gray text color
    fontFamily: "'Montserrat', sans-serif", // Montserrat font
  };

  const descriptionStyle = {
    marginBottom: "15px",
    color: "#555", // Dark gray text color
    fontFamily: "'Montserrat', sans-serif", // Montserrat font
  };

  const dateStyle = {
    fontSize: "0.8rem",
    color: "#777", // Light gray text color
    float: "right",
    fontFamily: "'Montserrat', sans-serif", // Montserrat font
  };

  return (
    <div
      className="container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="card my-3" style={cardStyle}>
        <div className="card-body">
          <h5 style={titleStyle}>{project.projectName}</h5>
          <div style={descriptionStyle}>{project.description}</div>
          <small className="text-muted" style={dateStyle}>
            Created on: {date.getDate()}/{date.getMonth() + 1}/
            {date.getFullYear()}
          </small>
        </div>
      </div>
    </div>
  );
}

export default ProjectItem;
