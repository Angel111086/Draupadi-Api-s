var Wishlist = require('../modal/wishlist.modal');
const passport = require('passport');

// //insert Api. User Token
// module.exports.insertWishlist = function(req,res,next)
// {
//     passport.authenticate('jwt',function(err,user)
//     {
//         console.log("IS Next", user);
//         if (err || !user) 
//         {            
//             console.log("User",err);
//             return res.json({ status: 401, success: false, message: "Authentication Fail." });
//         }
//         else if(user){               
//         let wlData = req.body;
//         var value,wishlist,count=0;
//         for(i=0;i<wlData.length;i++)
//         {
//             value = wlData[i];
//             console.log(Object.values(value));               
//             wishlist = new Wishlist(wlData[i]);                
//             if(!wishlist.product_id)
//             {
//                 return res.status(400).send({ error:true, message: 'Please Provide Product' });        
//             }
//             wishlist.user_id = user[0].user_id;
//             wishlist.statusId=1;
//             wishlist.createdById = user[0].user_id;
//             wishlist.creationDate = new Date;
//             Wishlist.createWishlist(wishlist, function(err, data) 
//             {
//                 if(err){
//                     res.send({status:400,success:false,message:"Details not saved."});
//                 }
//                 else{
//                     count++;
//                     if(count==wlData.length)
//                     {
//                         res.send({status:200,success:true,message:data.message});
//                     }
//                 }
//             });
//         }    
//     }
//   })(req,res,next)
// }

//insert Api. User Token
module.exports.insertWishlist = function(req,res,next)
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
            var wishlist = new Wishlist(req.body);                
            if(!wishlist.product_id)
            {
                return res.status(400).send({ error:true, message: 'Please Provide Product' });        
            }
            wishlist.user_id = user[0].user_id;
            wishlist.statusId=1;
            wishlist.createdById = user[0].user_id;
            wishlist.creationDate = new Date;
            Wishlist.createWishlist(wishlist, function(err, data) 
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




//Update Wishlist

module.exports.updateWishlist = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        let wlData = req.body;
        var value,wishlist,count=0;
        for(i=0;i<wlData.length;i++)
        {
            value = wlData[i];
            console.log(Object.values(value)); 
            var wishlist_id = wlData[i].wishlist_id;              
            wishlist = new Wishlist(wlData[i]);                  
            if(!wishlist.product_id)
            {
                return res.status(400).send({ error:true, message: 'No Product.' });        
            }
            wishlist.user_id = user[0].user_id;
            wishlist.modifiedById = user[0].user_id;
            wishlist.modificationDate = new Date;
            Wishlist.updateWishlist(wishlist_id,wishlist,function(err, data) 
            {
                if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                }
                else{
                    count++;
                    if(count==wlData.length)
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

module.exports.deleteWishlist = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){                          
        Wishlist.deleteWishlist(req.query.wishlist_id,function(err, data) 
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

module.exports.getAllWishlist = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            var user_id = user[0].user_id;
            Wishlist.getAllWishlist(user_id,function(err,data){
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
