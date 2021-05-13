const jwt = require('jsonwebtoken');
const config = require('../config/keys')

module.exports = function (req, res, next) {
    try {
        const token = req.header('Authorization').split(' ')[1];       //getting the token from the headers in the axios request and splitting the string here so we dont send the 'bearer' part as well. which will throw an error
        console.log("token: ", token)
        const verifedUser = jwt.verify(                 //verifying the token being sent with the secret jwt token to 
            token,                                      //validate authenticity
            config.secretOrKey
        )
        req.user = verifedUser.user;
        next();                                         //pushes the user to the next process upon successful validation
    } catch (error) {
        console.log(error)
        return res.send({
            msg: "server error"
        })
    }
}