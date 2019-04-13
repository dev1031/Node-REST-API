const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/signup',(req, res, next)=>{
    User.find({email: req.body.email})
    .exec()
    .then( user =>{
        if(user.length >=1){
            res.status(222).json({
                message: "User already exist"
            })
        }else{
            bcrypt.hash(req.body.password , 10,(err, hash)=>{
                if(err){
                    res.status(500).json({
                        error:err
                    });
               }else {
                    const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email : req.body.email,
                    password:hash
                });
                user
                .save()
                .then(result =>{
                    console.log(result);
                    res.status(200).json({
                        message: 'User successfully created',
    
                    });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            }
    
        });
        }
    }).catch( err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
});


router.post('/login', (req, res, next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length <1){
            console.log(user)
            return res.status(401).json({
                message:'Auth Failed'
            });
        }
        bcrypt.compare( req.body.password , user[0].password, (err, result)=>{
            if(err){
                console.log( err)
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    _id: user[0]._id
                }, process.env.JWT_KEY ,
                {
                    expiresIn : "1h"
                });
                console.log(token);
                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token
                });
            } })
    })
    .catch(err =>{
        console.log('err');
        req.status(500).json({
            error: err
        })
    });

});


router.delete('/:userId',( req ,res, next) =>{
    User.remove({_id: req.params.userId})
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json({
            message: 'User deleted',
            _id: result._id
        });
    })
    .catch(err =>{
        console.log('err');
        req.status(500).json({
            error: err
        });
    })
})

module.exports = router;