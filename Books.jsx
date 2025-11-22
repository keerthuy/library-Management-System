import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Books = () => {
  const [books, setBooks] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchALLBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8800/books");
        setBooks(res.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch books ❌");
      }
    };
    fetchALLBooks();
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await axios.get("http://localhost:8800/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsername(res.data.username);
        setUserId(res.data.id);
        localStorage.setItem("userId", res.data.id);
      } catch (err) {
        console.log(err);
        toast.error("Session expired, please login again ⚠️");
        navigate("/login");
      }
    };
    getProfile();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
      toast.success("Book deleted successfully 📕");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete book ❌");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully 👋");
    navigate("/login");
  };



  return (
    <div>
      
      <nav className="navbar">
        <h2 className="nav-title">📚 Book Era</h2>
        <div className="nav-right">
          <span className="nav-username">Hi, {username}</span>
          <button className="MyOrder" onClick={() => navigate(`/OrderList`)}>My Order</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

     
      <div className="books">
        {Array.isArray(books) && books.map((book) => (
        
        <div className="book" key={book.id}>
  {book.cover && <img src={book.cover} alt={book.title} />}
  <h2>{book.title}</h2>
  <p>{book.desc}</p>
  <span>Rs.{book.price}/-</span>

  <div className="book-actions">
    {book.userId === userId ? (
    
      <>
        <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
        <Link to={`/update/${book.id}`}>
          <button className="update">Update</button>
        </Link>
      </>
    ) : (
     
      <>
        <button
          className="more-details"
          onClick={() => setExpandedBook(expandedBook === book.id ? null : book.id)}
        >
          {expandedBook === book.id ? "Hide Details" : "More Details"}
        </button>
        <button onClick={() => navigate(`/Order/${book.id}`)} className="Order">
          Order Now
        </button>
      </>
    )}
  </div>

  {expandedBook === book.id && book.userId !== userId && (
    <div className="seller-details">
      <p><strong>Seller:</strong> {book.sellerName}</p>
      <p><strong>Email:</strong> {book.sellerEmail}</p>
      <p><strong>Contact:</strong> {book.sellerPhone}</p>
    </div>
  )}
</div>
        ))}     
      </div>
      <button className="add-btn">
        <Link to="/add">➕ Add new book</Link>
      </button>

  
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
