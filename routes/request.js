const express = require('express')

const router = express.Router()

const Users = require('../models/Users')

router.get('/sent', async (req, res) => {
    const sent_requests = await Users.find({"phone": req.body.phone}, {"sent": 1, "_id": 0})
    res.send(sent_requests);
})

router.get('/recieved', async (req, res) => {
    const recieved_requests = await Users.find({"phone": req.body.phone}, {"recieved": 1, "_id": 0})
    res.send(recieved_requests);
})

router.put('/sent', async (req, res) => {
    let sentPhone = req.body.sentPhone
    let reqPhone = req.body.phone
    await Users.update(
        {"phone": req.body.phone},
        {
            $push: {sent: sentPhone}
        }
    )

    let responseOfFind = []

    try{
        responseOfFind = await Users.find({"phone": sentPhone})
    }catch(err){
        console.log(err)
    }
    

    if(responseOfFind.length){
        await Users.update(
            {"phone": sentPhone},
            {
                $push: {recieved: reqPhone}
            }
        )

        res.send("Request recieved");
    }
    else{
        res.send("Doesnt exist")
    }

})



module.exports = router