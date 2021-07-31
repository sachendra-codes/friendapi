//sachin : 60f6dfa822efc116244d1565 sac@g.com
//vikram : 60f5949205523718c0bca7d3 vikram@g.com
//ani : 60f6e3aa14e6760df453112d ani@g.com

const User=require('../models/user');

//user/:userId
exports.getUser = (req, res) =>{
    User.findById(req.params.userId, (err, user)=>{
        if(err){
            res.status(400).json({
                error: "Can not find user"
            })
        }
        res.status(200).json(user)
    })
}
//add/:user1/:user2
exports.sendRequest = (req, res)=>{
    User.findOneAndUpdate(
        {_id : req.params.user1},
        { 
            $addToSet: { sentRequests: req.params.user2 },            
        },
        { new: true, runValidators: true, useFindAndModify : false },
        (err, user1)=> {
            if(err){
                res.status(400).json({
                    error : 'Can not send request'
                })
            }
            User.findOneAndUpdate(
                {_id : req.params.user2},
                {
                    $addToSet: { pendingRequests: req.params.user1 },            
                },
                { new: true, runValidators: true, useFindAndModify : false },
                (err, user2)=>{
                    if(err){
                        res.status(400).json({
                            error : 'Can not send request'
                        })
                    }
                    res.json({user1 : user1, user2 : user2});
                }
            )            
        }
    )    
}

//accept/:user1/:user2
exports.acceptRequest = (req, res) =>{
    User.findOneAndUpdate(
        { _id: req.params.user1},
        { 
            $addToSet: { friends: req.params.user2 },
            $pull : {pendingRequests : req.params.user2} 
        },
        { new: true, runValidators: true, useFindAndModify : false },
        (err, user1) => {
            if (err) {
              return res.status(400).json({
                error: "User Not found"
              });
            }
            User.findOneAndUpdate(
                { _id: req.params.user2 },
                { 
                    $addToSet: { friends: req.params.user1 },
                    $pull : {sentRequests : req.params.user1}
                },
                { new: true, runValidators: true, useFindAndModify : false },
                (err, user2)=>{
                    if (err) {
                        return res.status(400).json({
                          error: "User Not found"
                        });
                    }
                    return res.json({user1 : user1, user2 : user2});
                }
            )
        }
    )    
}

//reject/:user1/:user2
exports.rejectRequest = (req, res) =>{
    User.findOneAndUpdate(
        { _id: req.params.user1},
        {             
            $pull : {pendingRequests : req.params.user2} 
        },
        { new: true, runValidators: true, useFindAndModify : false },
        (err, user1) => {
            if (err) {
              return res.status(400).json({
                error: "User Not found"
              });
            }
            User.findOneAndUpdate(
                { _id: req.params.user2 },
                {                     
                    $pull : {sentRequests : req.params.user1}
                },
                { new: true, runValidators: true, useFindAndModify : false },
                (err, user2)=>{
                    if (err) {
                        return res.status(400).json({
                          error: "User Not found"
                        });
                    }
                    return res.json({user1 : user1, user2 : user2});
                }
            )
        }
    )    
}

//remove/:user1/:user2
exports.removeFriend = (req, res)=>{
    User.findOneAndUpdate(
        { _id: req.params.user1},
        {             
            $pull : {friends : req.params.user2} 
        },
        { new: true, runValidators: true, useFindAndModify : false },
        (err, user1) => {
            if (err) {
              return res.status(400).json({
                error: "User Not found"
              });
            }
            User.findOneAndUpdate(
                { _id: req.params.user2 },
                {                     
                    $pull : {friends : req.params.user1}
                },
                { new: true, runValidators: true, useFindAndModify : false },
                (err, user2)=>{
                    if (err) {
                        return res.status(400).json({
                          error: "User Not found"
                        });
                    }
                    return res.json({user1 : user1, user2 : user2});
                }
            )
        }
    )    
}

//friends/:userId
exports.allFriends = (req, res)=>{
    User.findById(req.params.userId).
    populate({
        path: 'friends',        
    }).
    exec(function (err, user) {
        if (err) return handleError(err);
        res.status(200).json(user.friends);
    });    
}

//sentRequests/:userId
exports.sentRequests = (req, res) => {
    User.findById(req.params.userId).
    populate({
        path: 'sentRequests',        
    }).
    exec(function (err, user) {
        if (err) return handleError(err);
        res.status(200).json(user.sentRequests);
    });    
}

//friendsRequests/:userId
exports.friendRequests = (req, res) => {
    User.findById(req.params.userId).
    populate({
        path: 'pendingRequests',        
    }).
    exec(function (err, user) {
        if (err) return handleError(err);
        res.status(200).json(user.pendingRequests);
    });    
}

exports.allUsers = (req, res) =>{
    User.find({}).exec((err, users)=>{
        res.json(users);
    })
}

//suggestions/:userId
exports.friendSuggestions = (req, res) => {
    User.findById(req.params.userId).
    populate({
        path: 'friends',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { 
            path: 'friends',            
        }
    }).
    exec(function (err, user) {
        // console.log("hello")
        if (err) return handleError(err);
        let friends = user.friends
        let suggestedFriend = new Set()
        for(let i =0; i<friends.length; i++){
            for(let j = 0; j<friends[i].friends.length; j++){
                suggestedFriend.add(friends[i].friends[j])
            }            
        }        
        res.status(200).json([...suggestedFriend]);
    });
}

const handleError= (err)=>{
    console.log(err)
}