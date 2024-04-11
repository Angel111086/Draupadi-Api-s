const pool = require('../authorization/pool');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var crypto = require('crypto');
const passport = require('passport');
//Admin Login Api
module.exports.adminLogin = function(req,res)
{    
    var username = req.body.username;  
    var password = req.body.password;
    var query= `select * from adminlogin where adminname='${username}'`;
    console.log(query);
    pool.query(query,function(err, user){
        if(err)
        {
            console.log(err);
            res.json({ status: 401, success: false, error: "Something Went Worng." });
        }
        else{     
            console.log('The solution is: ', user);
            console.log('Length', user.length);
            console.log('Password',password);
            if(user.length == 0){
                    return res.json({ status: 401, success: false, message: "Username does not Exists." });
            }             
            else if(user.length > 0)
            {                 
                if(user[0].adminpassword == password)
                {
                    console.log("working", user[0].adminpassword);         
                    var token = "";
                    var secret = "";
                    secret = {type: 'admin', _id: user[0].id, password: user[0].adminpassword};
                                              token = jwt.sign(secret, 'draupadibags', {
                                                  expiresIn: 31557600000
                                });
                    console.log("Demo=" + token);
                    res.send({status:200, success: true,
                              message:"Login Successful",token:token,
                    });
                }
                else{
                        res.send({status:200, success: false, 
                            message:"Password Mismatch"});
                    }
                }         
                else
                {
                    res.send({status:401, success: false, 
                        message:"Invalid Username and Password"});
                }
            }
            
        });  
}


module.exports.forgotPassword = function(req,res){
    var email = req.body.email
    if(email == ''){
        res.send({status:200,success:true,message:"Email Required"});
    }
    pool.query(`select adminemail from adminlogin where adminemail = '${email}'`, function(err,data){
        console.log('Data', data);
        if(err){
            res.send({status:200,success:true,message:"Something Went Wrong."});
        }
        if(data.length == 0 ){
            res.send({status:200,success:true,message:"No Email Available"});
        }
        else{            
            const token = crypto.randomBytes(20).toString('hex');

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true, 
                        ignoreTLS: false,
                        //secure: false,
                        auth: {
                            user: 'dev.cerbosys@gmail.com',
                            pass: 'Cerbosys@123!',
                        },
                    });

                    const mailOptions = {
                        from: 'dev.cerbosys@gmail.com',
                        to: email,
                        subject: 'Link To Reset Password',
                        text: 'You are receiving this because you have requested the reset of the password for your account.\n\n'
                        + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: \n\n'
                        // + `http://45.80.152.232:4000/resetPassword/${token}`
                        + `http://localhost:3000/resetPassword `
                        + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
                    };

                    transporter.sendMail(mailOptions, function(err,resp){
                        if(err){
                            console.log('Error' + err);
                            res.send({status:400,success:false,message:"Cannot Send Mail" });
                        }
                        else{
                            console.log('Sent');
                            res.send({status:200,success:true,message:"Recovery Email Sent."});
                        }
                    });

                }
            });

}

module.exports.resetPassword = function(req,res){
    var pass = req.body.password;
    var email = req.body.email;
    var qu = `update adminlogin set adminpassword='${pass}' where adminemail = '${email}'`;
    console.log(qu);
    pool.query(qu, function(err,data){
        if(err){
            res.send({status:400,success:false,message:"Something Went Wrong."});
        }
        else if(data.affectedRows==0){
            res.send({status:200,success:true,message:"Password cannot be updated. Please check your email."});
        }
        else{
            console.log(data);
            res.send({status:200,success:true,message:"Password Updated Successfully."});
        }
    });
}

module.exports.changePassword = function(req,res,next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var new_password = req.body.password;
            pool.query(`update adminlogin SET adminpassword='${new_password}' where id=${user[0].id}`,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"Password Cannot be Changed."});
                }
                else{
                    res.send({status:200,success:true,message:"Password Changed Successfully."});
                }
            })
        }
    })(req,res,next)

}