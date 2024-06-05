const jwt = require('jsonwebtoken');
const User = require('../Models/User_model')
require('dotenv').config();

const authentication = async (req,res,next)=>{
    try{
        const token = req.header("Authorization")
        const SecretKey = process.env.SecretKey;
        const user = jwt.verify(token,SecretKey);
        //console.log(user)
        User.findByPk(user.userId).then(user=>{
            req.user=user;
            next()
        }).catch(err=>{throw new Error(err)})
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false})
    }

}
module.exports={
    authentication
}