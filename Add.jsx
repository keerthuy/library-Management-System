import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Add = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    price: "",
    cover: "",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateInputs = () => {
    let isValid = true;
    
    if (!book.title.trim()) {
      toast.error("Title is required");
      isValid = false;
    }
    if (!book.desc.trim()) {
      toast.error("Description is required");
      isValid = false;
    }
    if (!book.price || isNaN(book.price) || Number(book.price) <= 0) {
      toast.error("Price must be a positive number");
      isValid = false;
    }
    if (!book.cover) {
      toast.error("Please upload a cover image");
      isValid = false;
    }
    if (!book.sellerName.trim()) {
      toast.error("Seller name is required");
      isValid = false;
    }
  
    if (!book.sellerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(book.sellerEmail)) {
      toast.error("Valid email is required");
      isValid = false;
    }
   
    if (!book.sellerPhone || isNaN(book.sellerPhone) || book.sellerPhone.toString().length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      isValid = false;
    }
    
    return isValid;
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to add a book");
      return;
    }

    if (!validateInputs()) {
      return;
    }

    try {
      await axios.post("http://localhost:8800/books", book, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Book added successfully!");
      navigate("/");
    } catch (err) {
      console.log("Error saving book:", err.response?.data || err);
      toast.error("Failed to save book. Try again!");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "keerthu");
    data.append("cloud_name", "dkntr0rt9");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dkntr0rt9/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImageData = await res.json();
      console.log("Uploaded Image URL:", uploadedImageData.url);

      setBook((prev) => ({
        ...prev,
        cover: uploadedImageData.url,
      }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed");
    }
  };

  return (
    <div className="form">
      <h1>Add New Book</h1>
      <input type="text" placeholder="Title" onChange={handleChange} name="title" />
      <input type="text" placeholder="Description" onChange={handleChange} name="desc" />
      <input type="number" placeholder="Enter price" onChange={handleChange} name="price" />
      <input type="file" onChange={handleFileUpload} name="cover" />
      <input type="text" placeholder="Seller Name" onChange={handleChange} name="sellerName" />
      <input type="text" placeholder="Email Address" onChange={handleChange} name="sellerEmail" />
      <input type="number" placeholder="Phone Number" onChange={handleChange} name="sellerPhone" />
      <button onClick={handleClick} className="formButton">Add</button>
    </div>
  );
};