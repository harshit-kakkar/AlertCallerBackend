const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Users = require('./models/Users')

app.use(express.json())
app.use(express.urlencoded({extended: true}))


mongoose.connect('mongodb://localhost/AlertCaller', 
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {console.log("connected to database users !!")
})



app.get('/', (req, res) => {
    res.send("Home page")
})


app.post('/register', async (req, res) => {
    const user = new Users({
        phone: req.body.phone,
        active: true
    })
    await user.save();
    res.send("User created successfully.")
    
})


app.get('/linked', async (req, res) => {
    const linked_contacts = await Users.find({"phone": req.body.phone}, {"linked": 1, "_id": 0});
    res.send(linked_contacts) 
})

app.listen(9183, () => {
    console.log("Server started on port : http://localhost:9183")
})