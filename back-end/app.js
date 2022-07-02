const express=require('express');
const sequelize=require('./utils/database');
const bodyParser=require('body-parser')
const path=require('path')
const cors=require('cors')
const dotenv = require('dotenv');
const helmet=require('helmet')
const morgan=require('morgan')
const fs=require('fs')


const User = require('./models/user');
const Expence = require('./models/expence');
const Order=require('./models/orders')
const Forgotpassword = require('./models/forgotpassword');

const userRoute=require('./routes/user')
const purchaseRoute=require('./routes/purchase')
const resetPasswordRoute=require('./routes/resetpassword')


const app=express();
app.use(cors())
dotenv.config();
app.use(helmet())

const acessLogStream=fs.createWriteStream(
    path.join(__dirname, 'access.log'),
     {flags:'a'})

app.use(morgan('combined', {stream:acessLogStream}))

app.use(express.json());  

app.use(userRoute)
app.use('/purchase', purchaseRoute)
app.use('/password', resetPasswordRoute)

//associations
User.hasMany(Expence);
Expence.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync()
.then(() => {
    app.listen( process.env.PORT || 2500)
console.log(`table created`);
}).catch((err) => {
    console.log(`Error `,err);
})

