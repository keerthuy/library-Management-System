import axios from 'axios';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export const Update = () => {

 const [book,setBook] = useState({
  title:"",
  desc:"",
  price: "",
  cover:"",
 });


const navigate = useNavigate();
const location = useLocation();

const bookId= location.pathname.split("/")[2];


 const handleChange = (e) => {
    setBook((prev) => ({...prev, [e.target.name]: e.target.value}));
 };


const handleClick = async e => {
  e.preventDefault()

 const token = localStorage.getItem("token"); 
  if (!token) {
    alert("You must be logged in to add a book");
    return;
  }

   try {
        await axios.put("http://localhost:8800/books/" + bookId, book, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
        navigate("/")
 }catch(err){
     console.log(err)
 }
}


const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "keerthu");
  data.append("cloud_name", "dkntr0rt9");

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dkntr0rt9/image/upload", {
      method: "POST",
      body: data
    });

    const uploadedImageData = await res.json();
    console.log("Uploaded Image URL:", uploadedImageData.url);

    
    setBook((prev) => ({
      ...prev,
      cover: uploadedImageData.url
    }));

  } catch (error) {
    console.error("Upload failed:", error);
  }
};



console.log(book);


  return (
    <div className='form'>
    <h1>Update the Book</h1>
     <input type='text' placeholder='title' onChange={handleChange}  name="title"/>
    <input type='text' placeholder='desc'  onChange={handleChange}  name="desc"/>
    <input type='number' placeholder='price' onChange={handleChange}  name="price"/>
    <input type='file' placeholder='cover' onChange={handleFileUpload}   name="cover"/>

    <button onClick={handleClick} className='formButton'>Add</button>

    </div>
  )
}
export default Update;