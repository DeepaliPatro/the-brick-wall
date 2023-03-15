const {Pool} = require('pg')

db = new Pool({
    database: "thebrickwall",
})
module.exports = db