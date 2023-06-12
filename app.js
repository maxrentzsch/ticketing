const express = require("express");
const path = require('path');
const mysql = require('mysql');
const dotenv = require("dotenv");

dotenv.config({ path: './.env'});

const app =express();

const db = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE
})

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false }));
app.use(express.json());

app.set('view.engine', 'hbs');

//db connection
db.connect( (error) => {
    if(error) {
        console.log(error)
    } else { 
        console.log("connection established")

    }
})

//Define Routes
app.use('/', require('./routes/pages.js'));
app.use('/auth.js', require('./routes/auth.js'));

//Define Port
app.listen(5001, () => {
    console.log("Server started on port 5001");
})