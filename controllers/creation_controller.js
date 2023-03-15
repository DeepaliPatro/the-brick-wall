const express = require('express')
const router = express.Router()
const ensureLoggedIn = require('./../middlewares/ensure_logged_in')
const db = require('./../db')

router.get('/', ensureLoggedIn, (req, res) => {
    const sql = `SELECT creations.*, username FROM creations JOIN users ON creations.user_id = users.id order by creations.time_posted desc;`
    db.query(sql, (err, dbRes) => {
        const creations = dbRes.rows
        res.render("home", {creations})
    })
})

router.get('/creations/new', (req, res) => {
    res.render("new_creation")
})

router.get('/creations/:id', (req, res) => {
    const sql = `SELECT creations.*, users.username FROM creations JOIN users ON creations.user_id = users.id WHERE creations.id = $1;`
    db.query(sql, [req.params.id], (err, dbRes) => {
        const creation = dbRes.rows[0]
        console.log(creation);
        res.render("creation_details", {creation})
    })
})

router.post('/creations', (req, res) => {
    const sql =`INSERT INTO creations (title, image_url, about, user_id) VALUES ($1, $2, $3, $4);`
    db.query(sql, [req.body.title, req.body.image_url, req.body.about, req.session.userId], (err, dbRes) => {
        res.redirect("/");
    })

})
router.get('/creations/:creation_id/edit', (req, res) => {
    const sql = `SELECT * FROM creations WHERE id = $1;`
    db.query(sql, [req.params.creation_id], (err, dbRes) => {
        res.render("edit_creation", {creation: dbRes.rows[0]})
    })
})

router.put('/creations/:creation_id', (req, res) => {
    const sql = `UPDATE creations set title = $1, image_url = $2 WHERE id = $3;`
    db.query(sql, [req.body.title, req.body.image_url, req.params.creation_id], (err, dbRes) => {
        res.redirect(`/creations/${req.params.creation_id}`)
    })
})

router.delete('/creations/:creation_id', (req, res) => {
    const sql = `DELETE FROM creations WHERE id=$1;`
    db.query(sql,[req.params.creation_id], (err, dbRes) => {
        res.redirect('/')
    })
})
module.exports = router