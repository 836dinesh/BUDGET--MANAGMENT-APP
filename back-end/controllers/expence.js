const Expence=require('../models/expence')

// exports.addexpence=(req,res)=>{
//     const{expence, Description, category}=req.body;
//     Expence.create( {expence,Description, category } )
//     .then((expence)=>{
//         res.json({expence, message:'expence added'})
//     })
//     .catch((err)=>{
//         res.json({sucess:false, error:err})
//     })
// }

exports.addexpence = (req, res) => {
    const { expence, Description, category } = req.body;
    req.user.createExpence({ expence, Description, category }).then(expense => {
        return res.status(201).json({expense, success: true } );
    }).catch(err => {
        return res.status(403).json({success : false, error: err})
    })
}

exports.getexpence=(req,res)=>{
    req.user.getExpences().then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        return res.status(402).json({ error: err, success: false})
    })
}

// for leaderboard
exports.getallexpences=(req, res)=>{
    const {userId}=req.body
    Expence.findAll({where:{userId:userId}})
    .then(expences=>{
        return res.status(200).json({expences, success: true})
    })
    .catch(err=>{
        return res.status(402).json({ error: err, success: false})
    })
}


exports.deleteExpence=(req,res)=>{
    const expenceid = req.params.expenceid;
    Expence.destroy({where: { id: expenceid }}).then(() => {
        return res.status(204).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(403).json({ success: true, message: "Failed"})
    })
}
