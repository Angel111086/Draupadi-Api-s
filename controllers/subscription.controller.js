var Subscription = require('../modal/subscription.modal');
const passport = require('passport');


module.exports.insertSubscription = function(req,res,next)
{               
    var subscription = new Subscription(req.body);  
    subscription.statusId=1;
    subscription.creationDate = new Date;
    Subscription.createSubscription(subscription, function(err, data) 
    {
        if(err){
                res.send({status:400,success:false,message:"Details not saved."});
        }
        else{
                res.send({status:200,success:true,message:data.message});
        }
    });
}    

//get All Subscription by admin token..

module.exports.getAllSubscription = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            Subscription.getAllsubscription(function(err,data){
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