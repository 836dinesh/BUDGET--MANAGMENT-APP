const user=require('../models/user')
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');


exports.signup=(req,res)=>{
    //console.log(req);
    const{name,email,phone,password}=req.body
    const saltRounds=10
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                console.log(`unable to create new user`);
                res.json({message:`unable to create new user`});
            }
            user.create( {name,email,phone,password:hash} )
            .then(()=>{
                res.json({message:'user created '})
            })
            .catch((err)=>{
                res.json({sucess:false, message:'email already exist'})
            })
        });
    });
}

function generateAccessToken(id) {
    return jwt.sign(id ,process.env.TOKEN_SECRET);
}

exports.login = (req, res) => {
    const { email, password } = req.body;
    //console.log(password);
    user.findAll({ where : { email }}).then(user => {
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, function(err, response) {
                if (err){
                console.log(err)
                return res.json({success: false, message: 'Something went wrong'})
                }
                if (response){
                    console.log(JSON.stringify(user))
                    const jwttoken = generateAccessToken(user[0].id);
                    res.json({token: jwttoken, success: true, user:user, message: 'Successfully Logged In'})
                // Send JWT
                } else {
                // response is OutgoingMessage object that server response http request
                return res.status(401).json({success: false, message: 'passwords do not match'});
                }
            });
        } else {
            return res.status(404).json({success: false, message: 'email do not match'})
        }
    })
}

exports.getallpremusersfromusertable =(req,res)=>{
    const {userId}=req.body
    user.findAll({where:{id:userId}}).then(users=>{
        return res.status(200).json({users, sucess:true})
    })
    .catch(err => {
        return res.status(402).json({ error: err, success: false})
    })
}

// exports.forgetpassword=(req,res)=>{
//     const { email  } = req.body;
//     user.findAll({ where : { email }}).then(user=>{
//         if(user.length==0){
//             return res.status(404).json({success: false, message: 'email do not match'})
//         }else {
//             return res.json({password:user[0].password})
//         }
//     })
// }

exports.download =  async (req, res) => {

    try {
        
        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING; // check this in the task. I have put mine. Never push it to github.
        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

        // V.V.V.Imp - Guys Create a unique name for the container
        // Name them your "mailidexpensetracker" as there are other people also using the same storage

        const containerName = 'prasadyash549yahooexpensetracker'; //this needs to be unique name

        console.log('\nCreating container...');
        console.log('\t', containerName);

        // Get a reference to a container
        const containerClient = await blobServiceClient.getContainerClient(containerName);

        //check whether the container already exists or not
        if(!containerClient.exists()){
            // Create the container if the container doesnt exist
            const createContainerResponse = await containerClient.create({ access: 'container'});
            console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
        }
        // Create a unique name for the blob
        const blobName = 'expenses' + uuidv1() + '.txt';

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        console.log('\nUploading to Azure storage as blob:\n\t', blobName);

        // Upload data to the blob as a string
        const data =  JSON.stringify(await req.user.getExpenses());

        const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
        console.log("Blob was uploaded successfully. requestId: ", JSON.stringify(uploadBlobResponse));

        //We send the fileUrl so that the in the frontend we can do a click on this url and download the file
        const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
        res.status(201).json({ fileUrl, success: true}); // Set disposition and send it.
    } catch(err) {
        res.status(500).json({ error: err, success: false, message: 'Something went wrong'})
    }

};