const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const db = require('./../db')

router.get('/users', (req, res) => {
    res.render('signup')
})

router.post('/users', (req, res) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, digestedPassword) {
            //check if existing user
            const sql1 = `SELECT * FROM users WHERE email = '${req.body.email}';`
            db.query(sql1, (err, dbRes) => {
                if(dbRes.rows.length > 0){
                    //user already exists in db, suggest login
                    res.redirect('/login')
                }
            })
            //compare confirm_password and pasword
            bcrypt.compare(req.body.confirm_password, digestedPassword, function(errro, result) {
                if(result){
                    // Store hash in your password DB.
                    const sql = `INSERT INTO users (username, email, password_digest) VALUES ($1, $2, $3) returning id;`
                    db.query(sql, [req.body.username, req.body.email, digestedPassword], (err, dbRes) => {
                        if(err) {
                            console.log(err);
                        } else {
                            req.session.userId = dbRes.rows[0].id
                            req.session.username = req.body.username
                            req.session.email = req.body.email
                            res.redirect('/')
                        }
                    })
                } else {
                    res.render('signup')
                }
            });
        });
    });
})
module.exports = router