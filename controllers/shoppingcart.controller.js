var ShoppingCart = require('../modal/shoppingcart.modal');
const pool = require('../authorization/pool');
const passport = require('passport');
var jimp = require("jimp");


module.exports.addToCart = function(req,res,next)
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
        try
        {    
            // if(!req.files.product_image){
            //     res.status(400).send({ success:false, message: 'Please Provide Product Image.' });        
            // }
            // else{ 
            // var fn = './public/cart/' + req.files.product_image[0].filename;  
            //  jimp.read(fn, function (err, img) {
            //  if (err) 
            //     throw err;
            //     img.resize(250, 250)            // resize
            //     .quality(100)              // set JPEG quality       
            //     .write('./public/cart/' + fn) // save
            //     console.log('Resized !!')              
            // });  
            // }
            // console.log('Testing1')
            // var file1 = (typeof req.files.design_image !== "undefined") ? req.files.design_image[0].filename : '';
            // console.log('filename1 ',file1 == '');
            // if(file1 == ''){
            //     file1 = '';
            // }
            // else{
            //     file1 = './public/cart/' + req.files.design_image[0].filename; 
            //     jimp.read(file1, function (err, img) {
            //     if (err) 
            //     throw err;
            //     img.resize(250, 250)            // resize
            //     .quality(100)              // set JPEG quality       
            //     .write('./public/cart/' + file1) // save
            //     console.log('Resized !!')              
            //     });
            // }
            // console.log('Req.Body', req.body);
            // console.log('Testing2')

            var cart = new ShoppingCart(req.body);   
            console.log('Cart', cart);
            if(!cart.product_name){
                    res.status(400).send({ success:false, message: 'Please Provide Product Name.' });        
            }
            cart.user_id = user[0].user_id;
            //cart.user_id = 0;
            cart.statusId=1;
            cart.createdById = user[0].user_id;
            cart.creationDate = new Date;
            ShoppingCart.createShoppingCart(cart, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
            
        
        }catch(e){ console.log("catch",e);   }  
        }
  })(req,res,next)
}


// module.exports.updateCart = function(req,res,next){
//     passport.authenticate('jwt',function(err,user)
//     {
//         if (err || !user) 
//         {          
//             return res.json({ status: 401, success: false, message: "Authentication Fail." });
//         }
//         else if(user){        
//         var cart = new ShoppingCart(req.body);            
//         cart.modifiedById = user[0].user_id;
//         cart.modificationDate = new Date;
//         ShoppingCart.updateShoppingCart(cart,req.body.cart_id,function(err, data) 
//         {
//             if(err){
//                 res.send({status:400,success:false,message:"Details not saved."});
//             }
//             else{
//                 res.send({status:200,success:true,message:data.message});
//             }
//         }); 
      
//     }
// })(req,res,next);
// }

module.exports.deleteCart = function(req,res,next){
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        ShoppingCart.deleteShoppingCart(req.query.cart_id,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not Deleted."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
})(req,res,next);
}

module.exports.getUserCartItems = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            ShoppingCart.getAllCartItems(user[0].user_id, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}

module.exports.getTotalCartProduct = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            pool.query(`SELECT sum(product_quantity) as quantity FROM shopping_cart WHERE user_id = ${user[0].user_id} AND StatusId=1`, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}

module.exports.getTotalCartItems = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            pool.query(`SELECT count(*) as count FROM shopping_cart WHERE user_id = ${user[0].user_id} AND StatusId=1`, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{
                    res.send({status:200,success:true,message:"Detail Found", data:data});
                }
            })
        }
    })(req,res,next)
}


module.exports.clearCart = function(req,res,next){
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        pool.query(`delete from shopping_cart where user_id in (${user[0].user_id})`,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not Deleted." + err});
            }
            else{
                res.send({status:200,success:true,message:"Cart Cleared."});
            }
        }); 
      
    }
})(req,res,next);
}