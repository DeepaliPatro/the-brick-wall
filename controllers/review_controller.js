const express = require('express')
const router = express.Router()
const ensureLoggedIn = require('./../middlewares/ensure_logged_in')
const db = require('./../db')

router.get('/creations/:creation_id/review/new', (req, res) => {
    res.render("new_review", {creation_id: req.params.creation_id})
})

router.post('/creations/:creation_id/review', (req, res) => {
    const sql = `INSERT INTO reviews (rating, comment, creation_id, reviewer_id) VALUES ($1, $2, $3, $4);`
    db.query(sql, [req.body.rating, req.body.comment, req.params.creation_id, req.session.userId], (err, dbRes) => {
        console.log(dbRes);
        res.redirect(`/creations/${req.params.creation_id}`)
    })
})

module.exports = router