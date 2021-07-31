var express = require('express');
const { sendRequest, 
    acceptRequest, 
    rejectRequest, 
    friendRequests, 
    allFriends, 
    removeFriend, 
    allUsers,
    friendSuggestions,
    sentRequests,
    getUser} = require('../controllers/user');

var router = express.Router()
const User=require('../models/user');

router.get('/user/:userId', getUser)
router.post('/add/:user1/:user2', sendRequest);
router.post('/accept/:user1/:user2', acceptRequest);
router.post('/reject/:user1/:user2', rejectRequest);
router.post('/remove/:user1/:user2', removeFriend);
router.get('/friends/:userId', allFriends);
router.get('/friendRequests/:userId', friendRequests);
router.get('/sentRequests/:userId', sentRequests)
router.get('/allUsers', allUsers);
router.get('/suggestions/:userId', friendSuggestions)
module.exports = router