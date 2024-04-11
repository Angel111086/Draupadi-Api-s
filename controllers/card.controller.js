const pool = require('../authorization/pool');
const passport = require('passport');

module.exports.getTotalOrders = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            pool.query(`SELECT count(*) as Total FROM orders 
            WHERE MONTH(creationDate) = MONTH(CURDATE()) AND StatusId=1`, function(err, data){
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

module.exports.getTotalRevenueByMonth = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            pool.query(`SELECT sum(product_quantity * product_price) as revenue 
            FROM orderdetail WHERE MONTH(creationDate) = MONTH(CURDATE()) AND StatusId=1`, function(err, data){
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

module.exports.getTotalUsers = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            pool.query(`SELECT count(*) as Total FROM user WHERE StatusId=1`, function(err, data){
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

module.exports.getTotalOffers = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            pool.query(`SELECT count(*) as Total FROM offer WHERE StatusId=1`, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found" + err});
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