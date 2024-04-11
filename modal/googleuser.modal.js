var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const GoogleUser = function(user) {   
  this.user_name = user.user_name;
  this.user_email = user.user_email;      
  this.user_imageurl = user.user_imageurl;   
  this.googleId = user.googleId;   
  this.statusId = user.statusId;
  this.createdById = user.createdById;  
  this.creationDate = user.creationDate;
  this.modifiedById = user.modifiedById;
  this.modificationDate = user.modificationDate;
};

GoogleUser.createLogin = function (login, result) {
    console.log('Login Details', login);
    pool.query(`select user_email from googlelogin where user_email = ${login.user_email}`,function(err,res){
        if(err){
            console.log("Select If",err);
        }
        else{
            try{
                if(res.length != 0){
                    result(err,{status:400,success:false,message:"Email already exists."}) ;
                }
                else{
                    pool.query("INSERT INTO googlelogin SET ?", login, function (err, res) {
                    if(err) {
                        result(err, null);
                    }
                    else{
                        result(null, {status:200,success:true,message:"Details Saved Successfully.", id: res.insertId});
                    }
                    });
                }
            }catch(e){console.log(e)}
        }
    });
};

GoogleUser.getAllUsers = function (result) {       
    pool.query(`select * from user Where statusId=1 order by user_id DESC`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

User.getUserById = function (id, result) {       
    pool.query(`select * from user Where statusId=1 and user_id=?`,[id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


module.exports = GoogleUser;