import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "https://protool-backend-deployment.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      }
    );
    const json = await response.json();
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem("token", json.authtoken);
      localStorage.setItem("PMTusername", json.name);
      props.showAlert("Login Successfully", "success");
      navigate("/");
    } else {
      props.showAlert("Invalid Credentials", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="container-fluid  align-items-center justify-content-center"
      style={{
        height: "75vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <h2 className="text-center mb-4">Login to continue with Protool</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          height: "400px",
          boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          padding: "20px",
          borderRadius: "8px",
          margin: "0 auto",
        }}
      >
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control mb-3"
            value={credentials.email}
            onChange={onChange}
            id="email"
            name="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp mb-3" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control mb-3"
            value={credentials.password}
            onChange={onChange}
            name="password"
            id="password"
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
