
const mysql = require('mysql');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
})

exports.register = (req, res) => {
    console.log(req.body);


    const { name, email, pass, passCon} = req.body;
    db.query('SELECT email FROM user WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error);
        } 
        if (res.length > 0) {
            return res.render('register.hbs', {
                message: 'Email wird bereits verwendet'
            })
        } else if( pass !== passCon)  {
            return res.render('register.hbs', {
                message: 'Passwörter stimmen nicht überein'
            })
        }

        let hashedPassword = await bcrypt.hash(pass, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO user SET ?', {Name: name, Mail: email, Password: hashedPassword}, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                return res.render('register.hbs', {
                    message: 'User Registriert'
                });
            }
        })
    });


}