import express from 'express';
import mysql from 'mysql2';
const app = express();

const db = mysql.createConnection({
   host:"localhost",
   user:"root",
   password:"Keerthu24#",
   database:"test"
})


app.use(express.json());

app.get("/", (req,res) => {
    res.json("hello this is backend")
})

app.get("/books" ,(req,res) => {
    const q= "SELECT  * FROM books"
    db.query(q,(err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})


app.post("/books",(req,res) => {
    const q =  "INSER INTO ('title','desc','cover') VALUES (?)"
    const values  = [
        req.body.title,
        req.body.desc,
        req.body.cover
    ]

    db.query(q,[values], (err,data) => {
        if(err) return res.json(err)
            return res.json("books can be created");
    })
})

app.listen(8800,() => {
    console.log("connected to backend:")
})