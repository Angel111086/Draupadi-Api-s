var Order = require('../modal/order.modal');
const pool = require('../authorization/pool');
const passport = require('passport');
const OrderDetail = require('../modal/orderdetail.modal');

module.exports.insertOrder = function(req,res,next)
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
        var order = new Order(req.body);  
        order.user_id = user[0].user_id              
        if(!order.user_id)
        {
            return res.status(400).send({ error:true, message: 'No User.' });        
        }
        else if(!order.totalAmount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Total Amount.' });        
        }
        else if(!order.payableAmount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payable Amount.' });        
        }
        else if(!order.shipping_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Shipping Address.' });        
        }
        else if(!order.payment_type)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payment Type.' });        
        }
        order.statusId=1;
        order.createdById = user[0].user_id;
        order.creationDate = new Date;
        Order.createOrders(order, function(err, data) 
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

//Update Order

module.exports.updateOrder = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var order = new Order(req.body);
        order.user_id = user[0].user_id;             
        if(!order.user_id)
        {
           return res.status(400).send({ error:true, message: 'No User.' });        
        }
        else if(!order.totalAmount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Total Amount.' });        
        }
        else if(!order.payableAmount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payable Amount.' });        
        }
        else if(!order.shipping_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Shipping Address.' });        
        }
        else if(!order.payment_type)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payment Type.' });        
        }       
        order.modifiedById = user[0].user_id;
        order.modificationDate = new Date;
        Order.updateOrders(req.body.order_id,order,function(err, data) 
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

//delete Order

module.exports.deleteOrder = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        var order = new Order(req.query);
        order.statusId = 0;           
        Order.deleteOrders(req.query.order_id,order,function(err, data) 
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
//For Admin..
module.exports.getAllOrders = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Order.getAllOrders(function(err,data){
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

//orders of the specific user..
//User Token
module.exports.getAllOrdersByUserId = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            Order.getAllOrdersByUser(user[0].user_id,function(err,data){
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
//All Orders According to month or date
//admin token
module.exports.getAllOrdersByDate = function(req,res,next)
{
    var from_date = req.query.from_date;
    var to_date = req.query.to_date;
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        Order.getAllOrdersByDate(from_date,to_date,function(err,data){
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


//-----------------------------Incoming Order----------------------------------------------------

module.exports.incomingOrder = function(req,res,next){
    passport.authenticate('jwt',function(err,user){
        if(err || !user){
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var query = `select ord.*, detail.*,pro.product_name,user.user_name from orders ord 
                         LEFT JOIN user as user ON(ord.user_id = user.user_id) 
                         LEFT JOIN orderdetail as detail ON(ord.order_id = detail.order_id) 
                         LEFT JOIN product as pro ON(detail.product_id = pro.product_id) 
                         Where ord.statusId=1 and ord.status Like 'Order Received' and date(ord.order_date) = CURDATE() `
            console.log(query);
            pool.query(query, function (err, data) {
            if(err) {
                res.send({status:400,success:false,message:"No Detail Found" + err});
            }
            else if(data.length == 0){                       
                res.send({status:200,success:true,message:"No Detail Available"});
            }
            else{
                res.send({status:200,success:true,message:
                    "Detail Found", data:data});
            }
        });
        }
    })(req,res,next);
}

module.exports.todayOrder = function(req,res,next){
    passport.authenticate('jwt',function(err,user){
        if(err || !user){
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var query = `select ord.*, detail.*,pro.product_name,user.user_name from orders ord 
            LEFT JOIN user as user ON(ord.user_id = user.user_id) 
            LEFT JOIN orderdetail as detail ON(ord.order_id = detail.order_id) 
            LEFT JOIN product as pro ON(detail.product_id = pro.product_id) 
            Where ord.statusId=1 and date(ord.order_date) = CURDATE() `
            console.log(query);
            pool.query(query, function (err, data) {
            if(err) {
                res.send({status:400,success:false,message:"No Detail Found"});
            }
            else if(data.length == 0){                       
                res.send({status:200,success:true,message:"No Detail Available"});
            }
            else{
                res.send({status:200,success:true,message:
                    "Detail Found", data:data});
            }
        });
        }
    })(req,res,next);
}

//-----------------------------------------------------------------------------------------------


//--------------------------------Checkout Api---------------------------------------------------
//User Token
module.exports.proceedToCheckout = function(req,res,next){
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
        var order = new Order(req.body);  
        order.user_id = user[0].user_id              
        if(!order.user_id)
        {
            return res.status(400).send({ error:true, message: 'No User.' });        
        }
        else if(!order.totalAmount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Total Amount.' });        
        }
        else if(!order.payableAmount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payable Amount.' });        
        }
        else if(!order.shipping_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Shipping Address.' });        
        }
        else if(!order.payment_type)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payment Type.' });        
        }
        order.statusId=1;
        order.createdById = user[0].user_id;
        order.creationDate = new Date;
        console.log("Orders", order);
        Order.createOrders(order, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                //res.send({status:200,success:true,message:data.message, id: data.id});
                console.log('Data Id', data.id[0].order_id); 
                console.log('Data ', data);
                var ord_id = data.id[0].order_id;
                var pa = data.id[0].payableamount;
                console.log("Payable", data.id[0].payableamount);
                insertOrderDetail(user[0].user_id,ord_id, pa,req,res);
            }
        });
    }    
  })(req,res,next)
}


insertOrderDetail = async function(user_id,order_id, pa,req,res){
try{
    console.log('OrderDetailId', order_id);
    let odData = req.body.products;
        var value,order,count=0;
        for(i=0;i<odData.length;i++)
        {
            value = odData[i];

            console.log(Object.values(value));  
            odData[i].order_id = order_id;
            order = new OrderDetail(odData[i]);   

            if(!order_id)
            {
                return res.status(400).send({ error:true, message: 'No Order.' });        
            }
            else if(!order.product_id)
            {
                return res.status(400).send({ error:true, message: 'Please Provide Product' });        
            }        
            order.statusId=1;
            order.createdById = user_id;
            order.creationDate = new Date;
            OrderDetail.createOrderDetail(order, function(err, data) 
            {
                if(err){
                    return res.send({status:400,success:false,message:"Details not saved." + err});
                }
                else{
                    count++;
                    if(count==odData.length)
                    {
                        console.log('Test PA Value', pa);
                        //res.send({status:200,success:true,message:data.message, id: order_id});
                        curlRazorPay(order_id,pa, res);
                    }
                }
            });
        }    
}catch(e){console.log(e)}
}

const request = require('request');


function curlRazorPay(oid,ap, res){
        var amt = ap;
        auth = "Basic " + Buffer.from('rzp_live_YqvALqyXMO07xs' + ":" + 'fhM5AH2EaKyQ5s2weTT9zqPg').toString("base64");
        var my_data = {
            "amount": amt,
            "currency": "INR" //wait yaha change karna
        }
        console.log("my data", my_data);
        request({
          url: `https://api.razorpay.com/v1/orders`, 
          headers: {"Authorization" : auth, "content-type": "application/json"},
          method: "POST", json: true, body: my_data}, function(err, response, json)
          {
            console.log('Test3');
            if (err) {
                console.log(err)
                throw err;
            }
            else
            {
                console.log('Razor JSON', json);
                res.send({status:200,success:true,message: "Details Saved Successfully.", orderId: oid, razor_orderId: json.id});
            }
          }      
        );
    
}




module.exports.updatePaymentStatus = function(req,res,next){
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
            var status = req.body.status;
            var payment_type = req.body.payment_type;
            var id = req.body.order_id;
            pool.query(`update orders set status='${status}',
            payment_type='${payment_type}' where order_id=${id}`,function(err,data){
            if(err){
                res.send({status:400,success:false,message:"Something went wrong." + err});
            }            
            else{
                res.send({status:200,success:true,message:"Detail Updated Successfully."});
            }
            });
        }
  })(req,res,next)
}

// module.exports.getOrdersByUserId = function(req,res,next)
// {
//     passport.authenticate('jwt',function(err,user)
//     {
//         if (err || !user) 
//         {          
//             return res.json({ status: 401, success: false, message: "Authentication Fail." });
//         }
//         else if(user){ 
//         Order.getOrdersByUserId(req.query.user_id,function(err,data){
//         if(err){
//             res.send({status:400,success:false,message:"No Detail Found"});
//         }
//         else if(data.length==0){
//             res.send({status:200,success:true,message:"No Detail Available"});
//         } 
//         else{
//             //res.send({status:200,success:true,message:"Detail Found", data:data});
//             getIdJsonData(res,data);
//         }
//     });
//   }
// })(req,res,next)
// }

module.exports.getOrdersByUserId = function(req,res){
    var user_id = req.query.user_id;
    var query = `select ord.*,od.*, pro.* 
    from orders as ord
    LEFT JOIN orderdetail as od ON(ord.order_id = od.order_id)  
    LEFT JOIN product as pro ON(od.product_id = pro.product_id) 
    Where ord.statusId=1 and ord.user_id=${user_id}
    order by ord.order_date DESC;`;
    pool.query(query,function(err,data){
        if(err){
            res.send({status:400,success:false,message:"No Detail Found"});
        }
        else if(data.length==0){
            res.send({status:200,success:true,message:"No Detail Available"});
        } 
        else{
            //res.send({status:200,success:true,message:"Detail Found", data:data});
            getIdJsonData(res, data);
        }
    });
}



function getIdJsonData(res,data){
    var Order = {};
var orderDetail = [];

data.forEach(function(row) {
   var bm = Order[row.order_id];
   console.log('Row',row);
   if (!bm) {
      bm = {
        user_name: row.user_name,
        order_id: row.order_id,
        user_id: row.user_id,
        totalAmount: row.totalAmount,
        discount: row.discount,
        payableamount: row.payableAmount,
        shipping_id: row.shipping_id,
        status: row.status,
        payment_type: row.payment_type,
        order_date: row.order_date,
        ordDet: []
      };

        Order[row.order_id] = bm;
        orderDetail.push(bm);
   }
   console.log('Product Name', row.product_name);
   bm.ordDet.push({
    product_id: row.product_id,
    product_name: row.product_name,
    product_quantity: row.product_quantity,
    product_price: row.product_price,
    product_dicount: row.product_discount,
    product_actualprice: row.product_actualprice,
    product_image: row.product_image,
    offer_id: row.offer_id,
    design_code: row.design_code,
    design_price: row.price
   });
});
//console.log(JSON.stringify(billingDetail));
res.send({status:200,success:true,message:"Detail Found", data:orderDetail});
}






//update shiprocket details

module.exports.updateShipRocketDetails = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var order = new Order(req.body);
       
        Order.updateShipRocketDetails(req.body.order_id,order,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not updated."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
    }
    
  })(req,res,next)
}