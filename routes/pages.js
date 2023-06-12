const express = require("express");

const router =  express.Router();

router.get('/index.hbs', (req, res) =>{
    res.render('index.hbs');

});

router.get('/register.hbs', (req, res) => {
    res.render('register.hbs');

});

router.get('/login.hbs', (req, res) => {
    res.render('login.hbs');

});


module.exports = router;
