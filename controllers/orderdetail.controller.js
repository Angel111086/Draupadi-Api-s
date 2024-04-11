var OrderDetail = require('../modal/orderdetail.modal');
const passport = require('passport');
//insert Api. User Token
module.exports.insertOrderDetail = function(req,res,next)
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
        let odData = req.body;
        var value,order,count=0;
        for(i=0;i<odData.length;i++)
        {
            value = odData[i];
            console.log(Object.values(value));               
            order = new OrderDetail(odData[i]);                
            if(!order.order_id)
            {
                return res.status(400).send({ error:true, message: 'No Order.' });        
            }
            else if(!order.product_id)
            {
                return res.status(400).send({ error:true, message: 'Please Provide Product' });        
            }        
            order.statusId=1;
            order.createdById = user[0].user_id;
            order.creationDate = new Date;
            OrderDetail.createOrderDetail(order, function(err, data) 
            {
                if(err){
                    res.send({status:400,success:false,message:"Details not saved."});
                }
                else{
                    count++;
                    if(count==odData.length)
                    {
                        res.send({status:200,success:true,message:data.message});
                    }
                }
            });
        }    
    }
  })(req,res,next)
}

//Update Order

module.exports.updateOrderDetail = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        let odData = req.body;
        var value,order,count=0;
        for(i=0;i<odData.length;i++)
        {
            value = odData[i];
            console.log(Object.values(value)); 
            var orderdetail_id = odData[i].orderdetail_id;              
            order = new OrderDetail(odData[i]);                  
            if(!order.product_id)
            {
                return res.status(400).send({ error:true, message: 'No Product.' });        
            }        
            order.modifiedById = user[0].user_id;
            order.modificationDate = new Date;
            OrderDetail.updateOrderDetail(orderdetail_id,order,function(err, data) 
            {
                if(err){
                    res.send({status:400,success:false,message:"Details not saved."});
                }
                else{
                    count++;
                    if(count==odData.length)
                    {
                        res.send({status:200,success:true,message:data.message});
                    }
                }
            }); 
        }
    }
    
  })(req,res,next)
}

//delete Order

module.exports.deleteOrderDetail = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        var order = new OrderDetail(req.query);
        order.statusId = 0;           
        OrderDetail.deleteOrderDetail(req.query.orderdetail_id,order,function(err, data) 
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

//Get All Orders

module.exports.getAllOrderDetail = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            //var order_id = req.query.order_id;
            OrderDetail.getAllOrderDetail(user[0].user_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
       }
  })(req,res,next)
}
