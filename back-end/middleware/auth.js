const jwt = require('jsonwebtoken');
const User = require('../models/user');
const premiumUser=require('../models/orders')
const dotenv = require('dotenv');
dotenv.config();


exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('authorization');
        //console.log(token);
        const userid = Number(jwt.verify(token, process.env.TOKEN_SECRET));
       // console.log(userid)
        User.findByPk(userid).then(user => {
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch(err => { throw new Error(err)})

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
        // err
      }
}

exports.premiumAuth = (req,res,next)=>{
  try {
    const token = req.header('authorization');
    console.log(token);
    const userid = Number(jwt.verify(token, process.env.TOKEN_SECRET));
    console.log(userid)
    premiumUser.fondOne({where : {userId : userid}}).then(user => {
        console.log(JSON.stringify(user));
        req.premiumuser = user;
        next();
    }).catch(err => { throw new Error(err)})

    // premiumUser.findAll({ where : { userid }}).then(order=>{
    //   console.log(JSON.stringify(order));
    //     req.premiumuser = order;
    //     next();
    // }).catch(err => { throw new Error(err)})
  //})

  } catch(err) {
    console.log(err);
    return res.status(401).json({success: false})
    // err
  }
}