const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const salt=10;
const Schema = mongoose.Schema
const UserSchema = new Schema({
    name:{
        type: String,
        required: true,
        maxlength: 100
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password:{
        type:String,
        required: true,
        minlength:6
    },
    friends : [{
        type : Schema.Types.ObjectId,
        ref: "User"
    }],
    sentRequests : [{
        type : Schema.Types.ObjectId,
        ref: "User"
    }],
    pendingRequests : [{
        type : Schema.Types.ObjectId,
        ref: "User"
    }],
    token:{
        type: String
    }
})

UserSchema.pre('save',function(next){
    var user=this;
    
    if(user.isModified('password')){
        bcrypt.genSalt(salt,function(err,salt){
            if(err)return next(err);

            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err);
                user.password=hash;
                user.password2=hash;
                next();
            })
        })
    }
    else{
        next();
    }
});

UserSchema.methods.comparepassword=function(password,cb){
    bcrypt.compare(password,this.password,function(err,isMatch){
        if(err) return cb(next);
        cb(null,isMatch);
    });
}

UserSchema.methods.generateToken=function(cb){
    var user =this;
    var token=jwt.sign(user._id.toHexString(),process.env.SECRET);

    user.token=token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

// find by token
UserSchema.statics.findByToken=function(token,cb){
    var user=this;
    jwt.verify(token,process.env.SECRET,function(err,decode){
        user.findOne({"_id": decode, "token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
};

//delete token
UserSchema.methods.deleteToken=function(token,cb){
    var user=this;

    user.update({$unset : {token :1}},function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

module.exports = mongoose.model('User', UserSchema);
