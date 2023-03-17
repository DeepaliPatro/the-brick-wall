const express = require('express')
const router = express.Router()
const ensureLoggedIn = require('./../middlewares/ensure_logged_in')
const upload = require("./../middlewares/upload")
const db = require('./../db')

router.get('/', ensureLoggedIn, (req, res) => {
    // const sql = `SELECT creations.*, username AS creations.username FROM creations JOIN users ON creations.user_id = users.id order by creations.time_posted desc;`
    const sql = `SELECT creations.*, users.username FROM (SELECT creations.*, avg(reviews.rating) FROM creations LEFT JOIN reviews ON creations.id = reviews.creation_id GROUP BY creations.id) AS creations JOIN users ON creations.user_id = users.id order by creations.time_posted desc;`
    db.query(sql, (err, dbRes) => {
        const creations = dbRes.rows
        // console.log(creations);
        res.render("home", {creations})
    })
})

router.get('/creations/new', (req, res) => {
    res.render("new_creation")
})

router.get('/creations/:id', (req, res) => {
    const sql = `SELECT creations.*, users.username FROM creations JOIN users ON creations.user_id = users.id WHERE creations.id =$1;`
    db.query(sql, [req.params.id], (err, dbRes) => {
        const creation = dbRes.rows[0]
        // console.log(creation);

        //check if the creation has any reviews
        const sqlCheck = `SELECT * FROM reviews WHERE creation_id = ${creation.id};`
        db.query(sqlCheck, (err, dbResCheck) => {
            // console.log(dbResCheck);
            if(dbResCheck.rows.length === 0){
                //no reviews to show
                const reviews = []
                const avgRating = 0
                res.render("creation_details", {creation, reviews, avgRating})
            } else {
                const sqlReviews = `SELECT reviews.rating, reviews.comment, reviews.time_published, reviews.reviewer_id, users.username FROM reviews JOIN users ON reviews.reviewer_id = users.id WHERE reviews.creation_id = ${creation.id};`
                db.query(sqlReviews, (error, results) => {
                    // console.log(results.rows);
                    const reviews = results.rows
                    const sqlAvg = `SELECT avg(rating) FROM reviews WHERE creation_id = ${creation.id};`
                    db.query(sqlAvg, (errorAvg, value) => {
                        const avgRating = value.rows[0].avg
                        res.render("creation_details", {creation, reviews, avgRating})
                    })
                })
            }
        })
    })
})

router.post('/creations', upload.single("uploadedFile"), (req, res) => {
    const sql =`INSERT INTO creations (title, image_url, about, user_id) VALUES ($1, $2, $3, $4);`
    db.query(sql, [req.body.title, req.file.path, req.body.about, req.session.userId], (err, dbRes) => {
        res.redirect("/");
    })

})
router.get('/creations/:creation_id/edit', (req, res) => {
    const sql = `SELECT * FROM creations WHERE id = $1;`
    db.query(sql, [req.params.creation_id], (err, dbRes) => {
        res.render("edit_creation", {creation: dbRes.rows[0]})
    })
})



router.put('/creations/:creation_id', upload.single("uploadedFile"), (req, res) => {
    const sql = `UPDATE creations SET title = $1, image_url = $2, about = $3 WHERE id = $4;`
    console.log(req.body.title, req.file.path, req.body.about, req.params.creation_id);
    db.query(sql, [req.body.title, req.file.path, req.body.about, req.params.creation_id], (err, dbRes) => {
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