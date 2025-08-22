import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const app = express();

const db = mysql.createConnection({
   host:"localhost",
   user:"root",
   password:"Keerthu24#",
   database:"test"
})


app.use(express.json());
app.use(cors())



app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 🔑 Hash password

    const q = "INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)";
    db.query(q, [username, email, hashedPassword], (err, data) => {
      if (err) return res.status(500).json({ error: err });
      return res.json({ message: "User registered successfully" });
    });
  } catch (error) {
    return res.status(500).json({ error: "Registration failed" });
  }
});




app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [email], (err, data) => {
    if (err) return res.json({ error: err });
    if (data.length === 0) return res.json({ message: "User not found" });

    const user = data[0];

    // Compare password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) return res.json({ message: "Wrong password" });

    // Generate token
    const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  });
});



const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.json({ message: "No token provided" });

  jwt.verify(token.split(" ")[1], "secretkey", (err, decoded) => {
    if (err) return res.json({ message: "Token is not valid" });
    req.userId = decoded.id;
    next();
  });
};


app.get("/profile", verifyToken, (req, res) => {
  const q = "SELECT id, username, email FROM users WHERE id = ?";
  db.query(q, [req.userId], (err, data) => {
    if (err) return res.json(err);
    res.json(data[0]);
  });
});


app.get("/", (req,res) => {
    res.json("hello this is backend")
})

app.get("/books" ,(req,res) => {
    const q= "SELECT  * FROM books";
    db.query(q,(err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})


app.post("/books",(req,res) => {
    const q =  "INSERT INTO Books (`title`,`desc`,`price`,`cover`) VALUES (?)";
    const values  = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ];

    db.query(q,[values], (err,data) => {
        if(err) return res.json(err)
            return res.json("books can be created");
    });
});


app.delete("/books/:id",(req,res) =>{
    const bookId = req.params.id;
    const q= "DELETE FROM books WHERE id = ?";


    db.query(q,[bookId],(err,data)=>{
          if(err) return res.json(err)
            return res.json("books has been deleted successfully.");
    })
})




app.put("/books/:id",(req,res) =>{
    const bookId = req.params.id;
    const q= "UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?";

    const values=[
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ]


    db.query(q,[...values,bookId],(err,data)=>{
          if(err) return res.json(err)
            return res.json("books has been updated successfully.");
    })
})



app.listen(8800,() => {
    console.log("connected to backend:")
})