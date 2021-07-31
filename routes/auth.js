var express = require('express');
const { login, signup, signout } = require('../controllers/auth');
var router = express.Router()
const User=require('../models/user');

router.post('/register',signup)
router.post('/login', login)
router.get('/signout', signout)
module.exports = router