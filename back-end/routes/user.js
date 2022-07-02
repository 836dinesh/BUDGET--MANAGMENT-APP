const express = require('express');
const usercontroller=require('../controllers/users');
const expenseController = require('../controllers/expence')
const authController=require('../middleware/auth');
const { route } = require('./resetpassword');

const router=express.Router();

router.post(`/signup`,usercontroller.signup)

router.post('/login',usercontroller.login )

router.post('/addexpences',authController.authenticate, expenseController.addexpence )

router.get('/getexpence',authController.authenticate, expenseController.getexpence )

router.delete('/deleteExpence/:expenceid',authController.authenticate, expenseController.deleteExpence )

router.get('/download', usercontroller.download)

router.post('/getallexpences',expenseController.getallexpences )

router.post('/getallpremusersfromusertable', usercontroller.getallpremusersfromusertable)


module.exports=router