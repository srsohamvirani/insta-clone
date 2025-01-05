const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const mongoose = require('mongoose');
const USER = mongoose.model('USER');

module.exports = (req, res,next) => {
    const {authorization} = req.headers;
    if(!authorization) {
        return res.status(401).json({error: "You must have logged in"});
    }
   res.json("ok")
 
       const token = authorization.replace("Bearer ", "");
       jwt.verify(token, JWT_SECRET, (err, payload) => {
           if(err) {
               return res.status(401).json({error: "You must have logged in"});
           }
           const {_id} = payload;
           USER.findById(_id).then(userData => {
            console.log(userData);
                
            });
       });
    
}