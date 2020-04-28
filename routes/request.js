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
                                //Logic to be added to push only unique phone numbers
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
                        // Logic to be added to register a non existent phone number
        const user = new Users({
            phone: sentPhone,
            active: false
        })
        await user.save();

        await Users.update(
            {"phone": sentPhone},
            {
                $push: {recieved: reqPhone}
            }
        )

        res.send("Created user with active status false and request recieved.")
    }

})

router.put('/sent/remove', async (req, res) => {
    let sentPhone = req.body.sentPhone
    let reqPhone = req.body.phone

    await Users.update(
        { "phone": reqPhone },
        { $pull: { 'sent': sentPhone } }
      );

    await Users.update(
        {"phone": sentPhone},
        { $pull: { 'recieved':  reqPhone } }
    )

    res.send("Deleted the phone from sent and recieved list");
})


router.put('/recieved/remove', async (req, res) => {
    let sentPhone = req.body.sentPhone
    let reqPhone = req.body.phone

    await Users.update(
        { "phone": reqPhone },
        { $pull: { 'recieved': sentPhone } }
      );

    res.send("Deleted the phone from recieved list");
})


router.put('/linked', async (req, res) => {
    let sentPhone = req.body.sentPhone
    let reqPhone = req.body.phone

    await Users.update(
        {"phone": reqPhone},
        {$push: {'linked': sentPhone}}
    )

    await Users.update(
        {"phone": reqPhone},
        {$pull: {'recieved': sentPhone}}
    )

    await Users.update(
        {"phone": sentPhone},
        {$push: {'linked': reqPhone}}
    )

    await Users.update(
        {"phone": sentPhone},
        {$pull: {'sent': reqPhone}}
    )

    res.send("Contacts have been linked and requests have been removed")
})




module.exports = router