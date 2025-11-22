import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Register = () => {
  const [inputs, setInputs] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (!inputs.username || !inputs.email || !inputs.password) {
      toast.error("All fields are required ❌");
      return;
    }
    if (!isValidEmail(inputs.email)) {
      toast.error("Enter a valid email address 📧");
      return;
    }
    if (inputs.password.length < 6) {
      toast.error("Password must be at least 6 characters 🔑");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8800/register", inputs);
      toast.success(res.data.message || "Registered successfully ✅");
      navigate("/login");
    } catch (err) {
      console.log("Error:", err);
      toast.error(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          name="username"
          placeholder="Username"
          value={inputs.username}
          onChange={handleChange}
        />
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
        <button type="submit">Register</button>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
