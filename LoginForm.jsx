import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!inputs.email || !inputs.password) {
      toast.error("Both fields are required ❌");
      return;
    }
    if (!isValidEmail(inputs.email)) {
      toast.error("Enter a valid email address 📧");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8800/login", inputs);

      if (res.data.token) {
        
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("email", inputs.email);
        localStorage.setItem("userId", res.data.user.id);

        toast.success("Login successful ✅");
        navigate("/");
        console.log("Login successful:", res.data);
      } else {
        toast.error(res.data.message || "Login failed ❌");
      }
    } catch (err) {
      console.log("Error:", err);
      toast.error(err.response?.data?.message || "Server error ⚠️");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          name="email"
          placeholder="Email"
          value={inputs.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={inputs.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
        <p>
          Don&apos;t have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};
