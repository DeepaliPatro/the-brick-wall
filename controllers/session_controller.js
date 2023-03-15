const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const db = require('./../db')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/sessions', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    //check if user exists in users table

    const sql = `SELECT * FROM users WHERE email = $1`
    db.query(sql, [email], (err, dbRes) => {
        if(dbRes.rows.length === 0){
            //user doesn't exist in users table
            //suggest signing up
            res.render('signup')
        }

        const user = dbRes.rows[0]
        //console.log(user);
        bcrypt.compare(password, user.password_digest, function(error, result) {
            if(result) {
                req.session.userId = user.id 
                req.session.username = user.username
                req.session.email = user.email

                res.redirect('/')
            } else {
                //wrong password, try again
                res.redirect("login")
            }
        });
    })
})

router.delete('/sessions', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})
module.exports = router