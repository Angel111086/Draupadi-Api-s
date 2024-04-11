var ShoppingCart = require('../modal/shoppingcart.modal');
var User = require('../modal/user.modal');
var Shipping = require('../modal/shipping.modal');
const pool = require('../authorization/pool');
const passport = require('passport');
var jimp = require("jimp");
var jwt = require('jsonwebtoken');
//AddtoCart Without Token

module.exports.addToCartWT = function(req,res)
{       
    try
    {    
          
        var cart = new ShoppingCart(req.body);   
        console.log('Cart', cart);
        if(!cart.product_name){
            res.status(400).send({ success:false, message: 'Please Provide Product Name.' });        
        }
        cart.user_id = 0;
        cart.statusId=1;
        cart.createdById = 0;
        cart.creationDate = new Date;
        ShoppingCart.createShoppingCart(cart, function(err, data) 
        {
            if(err)
            {
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
        }catch(e){ console.log("catch",e);   }  
}


//Login and insertShippingAddress

module.exports.userLoginWT = function(req,res)
{    
    var username = req.body.user_name;     
    var query= `select * from user where user_email='${username}'`;
    console.log(query);
    pool.query(query,function(err, user){
        if(err)
        {
            console.log(err);
            return res.json({ status: 401, success: false, error: "Something Went Wrong." });
        }
        else{     
            console.log('The solution is: ', user);
            if(user.length == 0){
                //return res.json({ status: 401, success: false, error: "Username does not Exists." });
                var shipping = new Shipping(req.body);
                var dataShipping = {
                    "first_name": shipping.first_name,//req.body.first_name
                    "last_name": shipping.last_name,
                    "address_line1": shipping.address_line1,
                    "address_line2": shipping.address_line2,
                    "landmark": shipping.landmark,
                    "state_name": shipping.state_name,
                    "city": shipping.city,
                    "postalcode": shipping.postalcode,
                    "mobilenumber": shipping.mobilenumber,
                    "address_type": shipping.address_type,
                    "statusId": 1,                    
                    "creationDate": new Date,
                    "modifiedById": null,
                    "modificationDate": null

                }
                console.log('ShippingDetailsLogin', shipping);   
                registerUser(username, dataShipping,res);
            }          
            else if(user.length > 0)
            {      
                var testAdd = getUserAddressCheck(user[0].user_id,username,res);
                
                if(testAdd == 0)
                {
                    
                    var shipping = new Shipping(req.body);
                    var dataShipping = {
                        "first_name": shipping.first_name,
                        "last_name": shipping.last_name,
                        "address_line1": shipping.address_line1,
                        "address_line2": shipping.address_line2,
                        "landmark": shipping.landmark,
                        "state_name": shipping.state_name,
                        "city": shipping.city,
                        "postalcode": shipping.postalcode,
                        "mobilenumber": shipping.mobilenumber,
                        "address_type": shipping.address_type,
                        "statusId": 1,                    
                        "creationDate": new Date,
                        "modifiedById": null,
                        "modificationDate": null
                    }
                    console.log('ShippingDetailsLogin', shipping);          
                    insertShippingAddress(user[0].user_id,username,dataShipping, res);
                    getUserAddress(user[0].user_id,username,res)
                }
                else{
                    getUserAddress(user[0].user_id,username,res)
                }

            }       
            else
            {
                return res.send({status:401, success: false, message:"Invalid Username and Password"});
            }
        }
            
        });  
}


function insertShippingAddress(user_id,username,shipping, res){
        //var shipping1 = new Shipping(shipping);  
        //var shipping1 = JSON.stringify(shipping);
        shipping.user_id = user_id     
        //console.log('ShippingDetailsInsertFN', shipping1.first_name); 
        console.log('ShippingDetailsInsert', shipping);         
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
        shipping.createdById = user_id;
        shipping.creationDate = new Date;
        Shipping.createShipping(shipping, function(err, data) 
        {
            if(err){
                return res.send({status:400,success:false,message:"Details not saved." + err});
            }
            else{
                //res.send({status:200,success:true,message:data.message});
                getUserAddress(user_id,username,res);
            }
        });
}

function getUserAddress(user_id, un,res){
    try{
        Shipping.getAllShipping(user_id,function(err,data){
            if(err){
                return res.send({status:400,success:false,message:"No Detail Found"});
            }
            else if(data.length==0){
                return res.send({status:200,success:true,message:"No Detail Available"});
            } 
            else{
                //res.send({status:200,success:true,message:"Detail Found", data:data});
                getLoginAndShippingDetails(data,un, user_id,res);
            }
        });
    }catch(e){console.log(e)}

}

function getUserAddressCheck(user_id, un,res){
    try{
        Shipping.getAllShipping(user_id,function(err,data){
            if(err){
                return -1;
            }
            else if(data.length==0){
                return 0
            } 
            else{
                return 1;
            }
        });
    }catch(e){console.log(e)}

}





function getLoginAndShippingDetails(shipping, un,user_id,res){
    try{
        var token = "";
        var secret = "";
        secret = {type: 'user', _id: user_id };
                                  token = jwt.sign(secret, 'draupadibags', {
                                      expiresIn: 31557600000
                    });
        console.log("Demo=" + token);
        res.send({status:200, success: true,
                  message:"Login Successful",user: un, userId: user_id,
                  token:token, shippingDetails:shipping[shipping.length-1]
        });
    }
    catch(e){console.log(e)}
}

function registerUser(username,dataShipping,res){
    try{
        var user = new User(username);  
        console.log('User', username);  
        user.user_email = username;
        user.user_name = username;              
        if(!user.user_email)
        {
            return res.status(400).send({ error:true, message: 'Please Provide User Email.' });        
        }
        user.statusId=1;
        //user.createdById = "";
        user.creationDate = new Date;
        User.createUserWT(user, function(err, data) 
        {
            if(err){
                return res.send({status:400,success:false,message:"User Details not saved." + err});
            }
            else{
    
                insertShippingAddress(data.id,username,dataShipping, res);           
                getLoginAndShippingDetails(dataShipping,username,data.id,res);
            }
        });
    }catch(e){console.log(e)}

}