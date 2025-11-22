import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export const Order = () => {
  const { id: bookIdParam } = useParams();
  const [order, setOrder] = useState({
    quantity: 1,
    address: "",
    paymentOption: "Cash on Delivery",
    phone: "",
    name: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log("User ID from localStorage:", userId);

    if (!token || !userId) {
      toast.error("You must be logged in to place an order");
      navigate("/login");
      return;
    }

    const orderData = {
      ...order,
       bookId: Number(bookIdParam),
      userId: Number(userId),
      quantity: Number(order.quantity),
      address: order.address,
      paymentOption: order.paymentOption,
      phone: order.phone,
      name: order.name,
    };

    console.log("Sending order data:", orderData);

    try {
      await axios.post("http://localhost:8800/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order placed successfully ✅");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.error || "Failed to place order ❌");
    }
  };

  return (
    <div className="form">
      <h2>Place Your Order</h2>

      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={order.quantity}
        onChange={handleChange}
        min={1}
      />

      <input
        type="text"
        name="address"
        placeholder="Delivery Address"
        value={order.address}
        onChange={handleChange}
      />

      <select
        name="paymentOption"
        value={order.paymentOption}
        onChange={handleChange}
      >
        <option value="Cash on Delivery">Cash on Delivery</option>
        <option value="Card">Card Payment</option>
      </select>

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={order.phone}
        onChange={handleChange}
      />

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={order.name}
        onChange={handleChange}
      />

      <button className="formButton" onClick={handleSubmit}>
        Place Order
      </button>
    </div>
  );
};
