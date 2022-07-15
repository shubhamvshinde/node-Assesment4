const exp = require('express').Router()
const users = require('../db')
const bcrypt = require('bcrypt')
const jswToken = require('jsonwebtoken')
const {check,validationResult}= require('express-validator')
exp.post('/signup',[
    check("email","Please Provide a valid mail")
    .isEmail(),
    check("password","please provide a valid password minimum 6 Charactors")
    .isLength({
        min:6
    })
],async(req,res)=>{
    const {email,password} = req.body
    //validating oue email and password
    const err = validationResult(req)
    if(!err.isEmpty()){
        return res.status(400).json({
            err:err.array()
        });
    }
    //validating if our user is existed or not
    let user = users.find((user)=>{
        return user.email==email;
    })
    if(user){
        res.status(400).json({
            "errors":[
                {
                "massage":"This user already existed"
                }
            ]
        })
    }
    let hashedPassword =await bcrypt.hash(password,10)
    console.log(hashedPassword);
    users.push({
        email,
        password:hashedPassword
    })
    // console.log(email,password)
    // res.send("Auth is Working")
    const token = await jwtToken.sign({
        email
    },"shubhamshinde",{
        expiresIn : 36000
    })
    // console.log(email,password)
    res.json({
        token
    })
    // res.send("Auth is working")
})

exp.post('/login',async(req,res)=>{
    const{password,email} = req.body
    let user = users.find((user)=>{
        return user.email === email; 
    })

    if(!user){
        return res.status(400).json({
             "err":[
                 {
                     "massege" : "invalid Credentill, Please Register first"
                 }
             ]
         })
     }

     let match  = await bcrypt.compare(password,user.password)
if(!match){
    return res.status(400).json({
         "err":[
             {
                 "massege" : "invalid Credentill"
             }
         ]
     })
 }

 const token = await jwtToken.sign({
    email
},"shubhamshinde",{
    expiresIn : 36000
})
res.json({
    token
})
})

exp.get('/shubh',(req,res)=>{
    res.json(users)
})
module.exports=exp;

