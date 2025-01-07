const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../keys")
const mongoose = require("mongoose")
const USER = mongoose.model("USER")

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must have logged in 1" })
    }
    const token = authorization.replace("Bearer ", "")
    console.log(token);
    
    console.log(JWT_SECRET);
    
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ error: "You must have logged in 2" })
          
        }
        
        const { _id } = await payload
        USER.findById(_id).then(userData => {
            req.user = userData
            console.log(req.user);
            
            next()  

        })
    })

}