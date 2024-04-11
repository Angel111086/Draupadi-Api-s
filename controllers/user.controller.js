var User = require('../modal/user.modal');
const pool = require('../authorization/pool');
const passport = require('passport');
const passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var jimp = require("jimp");
//insert User Api.
module.exports.registerUser = function(req,res)
{              
        var user = new User(req.body);                
        if(!user.user_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide User Name.' });        
        }
        // if(!user.user_password)
        // {
        //     return res.status(400).send({ error:true, message: 'Please Provide User Password.' });        
        // }
        // if(!user.user_mobile)
        // {
        //     return res.status(400).send({ error:true, message: 'Please Provide User Mobile.' });        
        // }
        user.statusId=1;
        //user.createdById = "";
        user.creationDate = new Date;
        User.createUser(user, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"User Details not saved." + err});
            }
            else{
                var token = "";
                var secret = "";
                secret = {type: 'user', _id: user[0].user_id, password: user[0].user_password};
                                          token = jwt.sign(secret, 'draupadibags', {
                                              expiresIn: 31557600000
                            });
                res.send({status:200,success:true,message:data.message});
            }
        });
}    


//User Login Api
// module.exports.userLogin = function(req,res)
// {    
//     var username = req.body.username;  
//     var password = req.body.password;
//     var query= `select * from user where user_name='${username}'`;
//     console.log(query);
//     pool.query(query,function(err, user){
//         if(err)
//         {
//             console.log(err);
//             res.json({ status: 401, success: false, error: "Invalid Username and Password." });
//         }
//         else{     
//             console.log('The solution is: ', user);
//             console.log('Length', user.length);
//             console.log('Password',password);          
//             if(user.length > 0)
//             {                
//                 if(passwordHash.verify(password,user[0].user_password))
//                 //if(user[0].user_password == password)
//                 {
//                     console.log("working", user[0].user_password);         
//                     var token = "";
//                     var secret = "";
//                     secret = {type: 'user', _id: user[0].user_id, password: user[0].user_password};
//                                               token = jwt.sign(secret, 'draupadibags', {
//                                                   expiresIn: 31557600000
//                                 });
//                     console.log("Demo=" + token);
//                     res.send({status:200, success: true,
//                               message:"Login Successful",token:token,
//                     });
//                 }
//                 else{
//                         res.send({status:200, success: false, 
//                             message:"Password Mismatch"});
//                     }
//                 }         
//                 else
//                 {
//                     res.send({status:401, success: false, 
//                         message:"Invalid Username and Password"});
//                 }
//             }
            
//         });  
// }

//Modified Api
module.exports.userLogin = function(req,res)
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
                return res.json({ status: 401, success: false, error: "Username does not Exists." });
            }          
            else if(user.length > 0)
            {                
       
                    var token = "";
                    var secret = "";
                    secret = {type: 'user', _id: user[0].user_id, password: user[0].user_password};
                                              token = jwt.sign(secret, 'draupadibags', {
                                                  expiresIn: 31557600000
                                });
                    console.log("Demo=" + token);
                    res.send({status:200, success: true,
                              message:"Login Successful",user: user[0].user_name, user_id: user[0].user_id,
                              token:token,
                    });
                }       
                else
                {
                    return res.send({status:401, success: false, 
                        message:"Invalid Username and Password"});
                }
            }
            
        });  
}



//-----User Login Api Ends------


//Update User Api...


module.exports.updateUser = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {            
            console.log("User",user);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        {
        try
        {    console.log('Auth User', user[0].user_id);
            if(!req.file)
            {
                
            
                var user = new User(req.body);
                console.log('User', user);      
                if(!user.user_mobile){
                    return res.status(400).send({ success:false, message: 'Please Provide User Mobile.' });        
                }
                user.statusId=1;
                //user.modifiedById = user[0].user_id;
                user.modificationDate = new Date;
                User.updateUser(req.body.user_id,user, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
            }    
            
            else{ 
            var fn = './public/user/' + req.file.filename;  
            //let newfileName = req.file.filename + ".png"
             jimp.read(fn, function (err, img) {
             if (err) 
                throw err;
                img.resize(250, 250)            // resize
                .quality(100)              // set JPEG quality       
                .write('./public/user/' + fn) // save
                console.log('Resized !!')              
            });  
            var user = new User(req.body,fn);
                console.log('User', user);      
                if(!user.user_mobile){
                    return res.status(400).send({ success:false, message: 'Please Provide User Mobile.' });        
                }
                user.statusId=1;
                //user.modifiedById = user[0].user_id;
                user.modificationDate = new Date;
                User.updateUser(req.body.user_id,user, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
            }    
        }catch(e){ console.log("catch",e);   }  }  
  })(req,res,next)
}

//For Admin, to see the number of users..will work with admin token

module.exports.getAllUsers = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            User.getAllUsers(function(err,data){
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

module.exports.getUserById = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            User.getUserById(req.query.user_id,function(err,data){
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

module.exports.getUserForUpdate = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
            User.getUserById(user[0].user_id,function(err,data){
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