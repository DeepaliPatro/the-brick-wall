const express = require('express')
const router = express.Router()
const ensureLoggedIn = require('./../middlewares/ensure_logged_in')
const db = require('./../db')

router.get('/review/new', (req, res) => {
    res.render("new_review")
})

module.exports = router