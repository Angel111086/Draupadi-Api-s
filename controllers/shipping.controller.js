var Shipping = require('../modal/shipping.modal');
const pool = require('../authorization/pool');
const passport = require('passport');


//Shipping Address Api's for user
//User Token
//insert Api.
module.exports.insertShippingAddress = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
        var shipping = new Shipping(req.body);  
        shipping.user_id = user[0].user_id              
        if(!shipping.user_id)
        {
            return res.status(400).send({ error:true, message: 'No User.' });        
        }
        else if(!shipping.first_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide First Name.' });        
        }
        else if(!shipping.last_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Last Name' });        
        }
        else if(!shipping.address_line1)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Shipping Address.' });        
        }
        else if(!shipping.city)
        {
            return res.status(400).send({ error:true, message: 'Please Provide City.' });        
        }
        else if(!shipping.postalcode)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Postal Code.' });        
        }
        else if(!shipping.mobilenumber)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Mobile Number.' });        
        }
        shipping.statusId=1;
        shipping.createdById = user[0].user_id;
        shipping.creationDate = new Date;
        Shipping.createShipping(shipping, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                //res.send({status:200,success:true,message:data.message});
                getShippingById(data.message,data.id, res);
            }
        });
    }    
  })(req,res,next)
}

//Update Shipping Address

module.exports.updateShippingAddress = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var shipping = new Shipping(req.body);
        shipping.user_id = user[0].user_id              
        if(!shipping.user_id)
        {
            return res.status(400).send({ error:true, message: 'No User.' });        
        }      
        else if(!shipping.address_line1)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Shipping Address.' });        
        }
        else if(!shipping.city)
        {
            return res.status(400).send({ error:true, message: 'Please Provide City.' });        
        }
        else if(!shipping.postalcode)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Postal Code.' });        
        }
        else if(!shipping.mobilenumber)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Mobile Number.' });        
        }
        shipping.statusId=1;
        shipping.modifiedById = user[0].user_id;
        shipping.modificationDate = new Date;
        Shipping.updateShipping(req.body.shipping_id,shipping,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                //res.send({status:200,success:true,message:data.message});
                getShippingById(data.message,req.body.shipping_id, res);
            }
        }); 
      
    }
    
  })(req,res,next)
}


function getShippingById(message, id, res){
    Shipping.getShippingById(id,function(err,data){
        if(err){
            res.send({status:400,success:false,message:"No Detail Found"});
        }
        else if(data.length==0){
            res.send({status:200,success:true,message:"No Detail Available"});
        } 
        else{
            
            res.send({status:200,success:true,message:message, data: data});
        }
    });
}

//delete Shipping

module.exports.deleteShippingAddress = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        var shipping = new Shipping(req.query);
        shipping.statusId = 0;           
        Shipping.deleteShipping(req.query.shipping_id,shipping,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }           
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
    }
  })(req,res,next)
}

//Get All Address of a user by its user_id

module.exports.getAllAddress = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            Shipping.getAllShipping(user[0].user_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:400,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}



module.exports.getAddressByShippingId = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            Shipping.getShippingById(req.query.shipping_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}