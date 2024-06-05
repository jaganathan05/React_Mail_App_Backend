const bcrypt = require('bcrypt');
const User = require('../Models/User_model');
const AllMail = require('../Models/AllMails')
const jwt = require('jsonwebtoken');
const Allmails = require('../Models/AllMails');
const { where } = require('sequelize');
const user = require('../Models/User_model');
require('dotenv').config();


exports.PostSignup = async (req,res,next)=>{

    try{
        const { email,  password } = req.body;
        console.log(User)
        //console.log(email , password)
         const usercheck = await User.findOne({
            where:{
                email:email,
            }
         });
         if(usercheck){
            return res.status(200).json({ success: true, message: 'User Already Have An Account' });
         }
    
       
        const result = await bcrypt.hash(password,10);
        console.log(result)
        const createUser = await User.create({
            email: email,
            password: result
        })
        
        if(createUser){
            return res.status(200).json({ success: true, message: 'Signup successful' })
        
        }
    }
        catch{
            return res.status(500).json({ success: false, message: 'Signup failed' });
        }

}

exports.PostLogin= async(req,res,next)=>{
    try{
        const { email,  password } = req.body;
        //console.log(email , password)
         const user = await User.findOne({
            where:{
                email:email,

            }
         });
         if(user){
            const checkpassword = await bcrypt.compare(password,user.password)

            if(checkpassword===true){
                return res.status(200).json({
                    success:true,
                    message:'login successfully',
                    idToken: generateToken(user.id)
                })
            }
            else {
                return res.status(401).json({success:false,message: 'User not authorized'});
            }
        }
        else {
            return res.status(404).json({success:false,message: 'User not found'});
        } 
    }
        catch{
            return res.status(500).json({ success: false, message: 'Login failed' });
        }
}

exports.PostMail = async(req,res,next)=>{
    try{
        const {email,subject,content}= req.body;

        const sendmail = await Allmails.create({
                sender : req.user.email,
                receiver : email ,
                subject : subject ,
                content : content ,
                userId : req.user.id ,
                read : false,
                delete : false
        })
    
        if(sendmail){
            return res.status(200).json({ success: true, message: 'Mail Sended' })
        
        }

    }
    
    catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: 'Mail Fail to send ' });
    }

}

exports.FetchReceivedMails = async(req,res,next)=>{

    const fetchmails = await Allmails.findAll({
        where : {
            receiver : req.user.email,
            delete : false
        },order: [
        ['createdAt', 'DESC'], 
      ],
    })

    

    if(fetchmails){
        return res.json({ success : true , message : 'received messages successfully ' , mails : fetchmails})
    }
    else{
        return res.json({ success : true , message : 'no received messages  ' })
  
    }

}

exports.updateread = async (req, res, next) => {
    console.log(req.params);
    try {
        if (req.user) {
            const response = await AllMail.update(
                { read: true },
                {
                    where: {
                        id: req.params.id 
                    }
                }
            );
           if(response){
            return res.status(200).json({ message: "Mail updated successfully", success : true })
           }
            ;
        } else {
           return  res.status(401).json({ message: "Unauthorized" ,success:false });
        }
    } catch (error) {
        console.error("Error updating mail read status:", error);
       return res.status(500).json({ message: "Internal server error" , success : false });
    }
};

exports.DeleteReciverMail = async(req,res,next)=>{
    try{
if(req.user){
    const selectmail = await AllMail.update(
        {delete : true },
        {
        where :{
            id : req.params.id,
        }
    }) 

    if(selectmail){
        return res.status(200).json({ success: true, message: "Mail deleted successfully" });
            } else {
                return res.status(404).json({ success: false, message: "Mail not found" });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }

}


exports.FetchSendedMails = async(req,res,next)=>{

    const fetchmails = await Allmails.findAll({
        where : {
            sender : req.user.email,
            userId : req.user.id
        },order: [
        ['createdAt', 'DESC'], 
      ],
    })
    
    if(fetchmails){
        return res.json({ success : true , message : 'sended messages successfully ' , mails : fetchmails})
    }
    else{
        return res.json({ success : true , message : 'no sended messages  ' })
  
    }

}
exports.DeleteSenderMail = async(req,res,next)=>{
    try{
if(req.user){
    const selectmail = await AllMail.findOne(
        {
        where :{
            id : req.params.id,
            userId : req.user.id
        }
    }) 

    if(selectmail){
        await selectmail.destroy();
        return res.status(200).json({ success: true, message: "Mail deleted successfully" });
            } else {
                return res.status(404).json({ success: false, message: "Mail not found" });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }

}


function generateToken(id){
    const SecretKey = process.env.SecretKey;
    return jwt.sign({userId : id },SecretKey)
}