const express = require('express');
const app = express();
const cors =require("cors");
const bodyParser = require('body-parser')
const mysql = require('mysql2');

// database credentials
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Hello",
    database: "rental_system",
});
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.listen(3001,() =>
{
    console.log("Running on the port 3001")
});
