const Razorpay = require('razorpay');
const Order = require('../models/orders')


const purchasepremium =async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 500;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(err);
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

 const updateTransactionStatus = (req, res ) => {
    try {
        const { payment_id, order_id} = req.body;
        Order.findOne({where : {orderid : order_id}}).then(order => {
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                return res.status(202).json({sucess: true, message: "Transaction Successful"});
            }).catch((err)=> {
                throw new Error(err);
            })
        }).catch(err => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

    }
}

const checkPremiumMembership=(req,res)=>{
    const {userId}=req.body
    Order.findOne( {where:{ userId:userId}})
    .then(order=>{
        if(order){
             return res.status(200).json({sucess: true, message: "checking of premium user is Successful"});
        }else {
            return res.status(400).json({sucess: false, message: "not a premium user "})
        }
    })
    .catch(err => {
        throw new Error(err);
    })
}

const getallpremusers=(req,res)=>{
    Order.findAll().then(orders=>{
        //totalexpences=JSON.stringify(expences)
        return res.status(200).json({orders, success: true})
    })
    .catch(err => {
        return res.status(402).json({ error: err, success: false})
    })
}


module.exports = {
    purchasepremium,
    updateTransactionStatus,
    checkPremiumMembership,
    getallpremusers
}