const User=require('../models/user');
const jwt=require('jsonwebtoken');
const expressJwt = require('express-jwt')
exports.auth =(req,res,next)=>{
    let token =req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({
            error :true
        });
        req.token= token;
        req.user=user;
        next();
    })
}

exports.signup= (req, res) =>{
    console.log(req.body)
    const newuser=new User(req.body);       
    User.findOne({email:newuser.email},(err,user)=>{
        if(err) return res.status(400).json({message : 'Can not register'})
        if(user) return res.status(400).json({ auth : false, message :"email exits"});
        newuser.save((err,doc)=>{
            if(err) {console.log(err);
                return res.status(400).json({ success : false});}
            res.status(200).json({
                succes:true,
                user : doc
            });
        });
    });
}

exports.login = (req, res)=>{
    const {email, password} = req.body;
    User.findOne({email}, (err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error : "User does not exists"
            })
        }
        user.comparepassword(password, (err, isMatch)=>{
            if(!isMatch){
                return res.status(401).json({
                    error: "Email and password do not match"
                });
            }
            else{
                var auth = jwt.sign(user._id.toHexString(),process.env.SECRET);
                res.cookie("auth", auth, { expire: new Date() + 9999 });
                const { _id, name, email } = user;
                return res.json({ auth, user: { _id, name, email } });
            }
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie("auth");
    res.json({
        message: "User signout successfully"
    });
};

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['sha1', 'RS256', 'HS256'],
    userProperty: "auth"
});


