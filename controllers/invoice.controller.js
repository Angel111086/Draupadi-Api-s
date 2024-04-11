var Shipping = require('../modal/shipping.modal');
const pool = require('../authorization/pool');
const passport = require('passport');

//generate Invoice. user Token
module.exports.generateInvoice = function(req,res,next)
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
        var invoice = new Invoice(req.body);                
        if(!invoice.order_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Order details.' });        
        }
        else if(!invoice.shipping_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Shipping details.' });        
        }
        else if(!invoice.total_amount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Total Amount.' });        
        }
        else if(!invoice.amount_payable)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payable Amount.' });        
        }
        else if(!invoice.payment_mode)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Payment Mode.' });        
        }
        invoice.invoice_date = new Date;
        invoice.user_id = user[0].user_id;
        invoice.statusId=1;
        invoice.createdById = user[0].user_id;
        invoice.creationDate = new Date;
        Invoice.createInvoice(invoice, function(err, data) 
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

//printing details for the invoice.
module.exports.printInvoice = function(req,res,next)
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
            var view_query;
            var shipping_id = req.query.shipping_id;
            var order_id = req.query.order_id;

            if(user[0].user_id){
                if(order_id){
                    if(shipping_id){
                        view_query=`select inn.*, ship.* from invoice inn
                                    LEFT JOIN shippingaddress as ship ON (inn.shipping_id = ship.shipping_id)
                                    where ship.shipping_id=${shipping_id}`;
                    }
                }
            }

            pool.query(view_query, function(err, data){
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
//Invoice Ends 
