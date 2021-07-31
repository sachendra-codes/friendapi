//Article login signup: https://medium.com/@sarthakmittal1461/to-build-login-sign-up-and-logout-restful-apis-with-node-js-using-jwt-authentication-f3d7287acca2
//Article many to many relationship : https://dev.to/nehalahmadkhan/many-to-many-relationship-in-mongodb-nodejs-express-mongoose-4djm
require('dotenv').config()
const express = require('express')
const port = process.env.PORT || 4000
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const { isSignedIn } = require('./controllers/auth')


const app = express()

app.use(cors())
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const db = process.env.DBSTRING;

mongoose
    .connect(db, { 
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
  
app.get('/',isSignedIn, (req, res) => {
  res.json({message : 'Hello World!'})
})

app.use('/api', authRoutes);
app.use('/api',userRoutes);
app.listen(port, () => {
  console.log(`App is running at port: ${port}`)
})

