const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const upload = require("./middlewares/upload")
const logger = require('./middlewares/logger')
const methodOverride = require('./middlewares/method_override')
const creationController = require('./controllers/creation_controller')
const sessionController = require('./controllers/session_controller')
const userController = require('./controllers/user_controller')
const reviewController = require('./controllers/review_controller')
const setCurrentUser = require('./middlewares/set_current_user')
const viewHelpers = require('./middlewares/view_helpers')

const expressLayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static("public"))
app.use(logger)
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride)
app.use(    
    session({
        cookie: { maxAge: 86400000 },
        store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
        }),
        secret: process.env.SESSION_SECRET || "mistyrose",
        resave: false,
        saveUninitialized: true
    })
)

app.use(setCurrentUser)
app.use(viewHelpers)
app.use(creationController)
app.use(sessionController)
app.use(userController)
app.use(reviewController)

app.listen(port, () => {
    `listening on port ${port}`
})