const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const auth = require('../middleware/MiddlewareAuth')

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateUpdateInput = require("../validation/update");

// Load User model
const userSchema = require("../models/User");

router.get('/', auth, async (req, res) => {
    try {
        const user = await userSchema.find()
        console.log("USER : ", user)
        if (user) {
            res.status(200).json({
                "users": user,
                "success": true
            })
        }
    } catch (error) {
        res.status(500).json({
            "error": error,
            "success": false
        })
    }
})

router.post('/login', async (req, res) => {
    console.log(req.body)
    const { errors, isValid } = validateLoginInput(req.body);
    const { email, password } = req.body;
    if (!isValid) {
        res.status(500).json({
            "error": errors,
            "success": false
        })
    }

    try {
        const userAuth = await userSchema.findOne({ email })
        console.log(userAuth)
        if (userAuth) {
            const payload = {
                user: userAuth._id,
            }

            const match = await bcrypt.compare(password, userAuth.password)
            console.log(match)
            if (match) {
                jwt.sign(payload, keys.secretOrKey, (err, token) => {
                    res.status(200).json({
                        "token": token,
                        "user": userAuth,
                        "success": true
                    })
                })
            } else {
                res.status(500).json({
                    error: "Wrong password.",
                    success: false
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            "error": error,
            "success": false
        })
    }
})

router.post('/register', async (req, res) => {
    console.log(req.body);
    const { name, email, phone, password } = req.body;
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        res.status(500).json({
            "errors": errors,
            "success": false
        })
    }

    try {
        const exists = await userSchema.findOne({ email, phone })

        if (exists) {
            res.status(500).json({
                "error": 'User already exists!',
            })
        } else {
            const newUser = new userSchema({
                name: name,
                email: email,
                phone: phone,
                password: password
            })

            const salt = await bcrypt.genSalt(15);
            const hashedPassword = await bcrypt.hash(password, salt);
            newUser.password = hashedPassword;

            await newUser.save().then(resp => {
                console.log(resp);
                const payload = {
                    id: resp.id
                }

                jwt.sign(payload, keys.secretOrKey, (err, token) => {
                    res.status(200).json({
                        "token": token,
                        "user": resp,
                        "success": true
                    })
                })
            })
                .catch(err => {
                    res.status(500).json({
                        "error": err,
                        "success": false
                    })
                })

        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            "error": error
        })
    }
})

router.post('/update', auth, async (req, res) => {
    console.log(req.body)
    const { _id, name, email, phone, isDeleted } = req.body;
    const { isValid, errors } = validateUpdateInput(req.body)
    console.log(errors)
    if(!isValid){
        res.status(500).json({
            errors: errors,
            success: false
        })
    }

    try {
        const userExists = await userSchema.findOne({ _id })
        console.log(userExists)
        if(userExists){
            userExists.name = name,
            userExists.email = email,
            userExists.phone = phone,
            userExists.isDeleted = isDeleted,

            await userExists.save().then(resp => {
                console.log(resp)
                res.status(200).json({
                    updatedUser: userExists,
                    success: true
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err,
                    success: false
                })
            })
        } else {
            res.status(500).json({
                error: 'User not found!',
                success: false
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false
        })
    }
})
// router.get('/', auth, async (res, req) => {
//     console.log(req.req.body)
// })

// router.post('/register', async (res, req) => {
//     console.log("sup")
//     console.log(req.req);


//     const { errors, isValid } = validateRegisterInput(req.req.body);
//     const { name, email, password, phone } = req.req.body
//     if (!isValid) {
//         return res.res.status(400).json(errors);
//     }

//     const user = await userSchema.findOne({ email: email })

//     if (user) {
//         return res.res.status(400).json({ email: 'user already exists' })
//     } else {
//         const newUser = new userSchema({
//             name: name,
//             email: email,
//             phone: phone,
//             password: password
//         });

//         // Hash password before saving in database
//         bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(newUser.password, salt, (err, hash) => {
//                 if (err) throw err;
//                 newUser.password = hash;
//                 newUser.save().then(user => {
//                     res.res.json(user)
//                 })
//                     .catch(err => {
//                         res.res.json(err)
//                     });
//             });
//         });
//     }
// });

// router.get('/login', async (res, req) => {
//     const { email, password } = req.b
//     const { errors, isValid } = validateLoginInput(req.body);

//     if (!isValid) {
//         return res.res.status(400).json(errors);
//     }

//     const userAuth = userSchema.findOne({ email }).then(user => {
//         console.log(user)
//         const match = bcrypt.compare(user.password, password).then((match) => {
//             console.log("match: ", match)
//             const payload = {
//                 id: user.id,
//                 name: user.name
//             };

//             console.log(keys.secretOrKey)
//         })
//             .catch(err => {
//                 res.res.send(err);
//             })

//         if (match) {
//             console.log("password match")
//             //if password is matched then the payload with id of the user is sent over to get the token from jwt.sign
//             const payload = {
//                 user: {
//                     id: user._id
//                 }
//             }
//             console.log(payload)

//             jwt.sign(
//                 payload,
//                 keys.secretOrKey,
//                 (err, token) => {
//                     res.res.send({ 
//                         "token": token,
//                         "user": user
//                     });
//                 }
//             )
//         }
//     })
//         .catch(err => {
//             return res.res.status(400).json({
//                 passwordincorrect: 'Password Incorrect',
//                 err: err
//             })
//         })
// });

module.exports = router;