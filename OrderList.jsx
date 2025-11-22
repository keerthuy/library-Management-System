import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const OrderList = () => {
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        
        const resBuyer = await axios.get(
          `http://localhost:8800/orders/buyer/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBuyerOrders(resBuyer.data);

       
        const resSeller = await axios.get(
          `http://localhost:8800/orders/seller/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSellerOrders(resSeller.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch orders ❌");
      }
    };

    fetchOrders();
  }, [userId, token]);

  return (
    <div>
      <h2>Your Orders</h2>
      {buyerOrders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Seller</th>
              <th>Address</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {buyerOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.title}</td>
                <td>{order.quantity}</td>
                <td>{order.price}</td>
                <td>{order.sellerName || "—"}</td>
                <td>{order.address}</td>
                <td>{order.paymentOption}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Orders on Your Books</h2>
      {sellerOrders.length === 0 ? (
        <p>No orders received yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Phone Number</th>
              <th>Buyer</th>
              <th>Address</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {sellerOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.title}</td>
                <td>{order.quantity}</td>
                <td>{order.price}</td>
                <td>{order.phone}</td>
                <td>{order.name || "—"}</td>
                <td>{order.address}</td>
                <td>{order.paymentOption}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
