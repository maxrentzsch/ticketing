
const mysql = require('mysql');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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

exports.login = async (req, res) => {

    try {
        const { email, pass } = req.body;

        if( !email || !pass ) {
            return res.status(400).render('login.hbs', {
                message: 'Bitte Email und Passwort eingeben'
            })
        }

        db.query('SELECT * FROM user WHERE Mail = ?', [email], async (error, results) => {
            console.log(results);
            if( !results || !(await bcrypt.compare(pass, results[0].Password))) {
                res.status(401).render('login.hbs', {
                    message: 'Email oder Passwort falsch'
                })
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 *1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions );
                res.status(200).redirect("/index.hbs");
            }
        })

    } catch (error) {
        console.log(error);
    }
}
