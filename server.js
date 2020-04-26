const express = require('express')

const app = express()


app.get('/', (req, res) => {
    res.send("Home page")
})


app.listen(9183, () => {
    console.log("Server started on port : http://localhost:9183")
})