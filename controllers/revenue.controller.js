const pool = require('../authorization/pool');
const passport = require('passport');


module.exports.getAllYearRevenue = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_query;
            // my_query = ` SELECT YEAR(orders.order_date) as Years,SUM(orderdetail.product_quantity*orderdetail.product_price) as revenue
            // FROM orders, orderdetail where orders.order_id = orderdetail.order_id and orders.statusId=1 
            // GROUP BY YEAR(orders.order_date) 
            // `;
            my_query = ` SELECT YEAR(orders.order_date) as Time,SUM(orderdetail.product_quantity*orderdetail.product_price) as revenue
            FROM orders, orderdetail where orders.order_id = orderdetail.order_id and orders.statusId=1 
            GROUP BY YEAR(orders.order_date) 
            `;
            pool.query(my_query, function(err, data){
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




module.exports.getMonthlyRevenue = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_year = req.query.year;
            pool.query(`select date_format(order_date,'%b') as Time,sum(product_price*product_quantity)as 
            revenue from orders,orderdetail where orders.order_id=orderdetail.order_id 
            and year(order_date)= ${my_year}
            group by date_format(order_date,'%b') `, function(err, data){
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

// module.exports.getMonthlyRevenue = function(req, res, next){
//     passport.authenticate('jwt', function(err, user){
//         if (err || !user) 
//         {          
//             return res.json({ status: 401, success: false, message: "Authentication Fail." });
//         }
//         else if(user){
//             var my_year = req.query.year;
//             var my_month = req.query.month;
//             pool.query(`select date_format(order_date,'%b') as months,sum(product_price*product_quantity)as revenue 
//             from orders,orderdetail where orders.order_id=orderdetail.order_id 
//             and year(order_date) = ${my_year} and month(order_date) = ${my_month}
//             group by date_format(order_date,'%b')`, function(err, data){
//                 if(err){
//                     res.send({status:400,success:false,message:"No Detail Found"});
//                 }
//                 else if(data.length == 0){
//                     res.send({status:200,success:true,message:"No Detail Available"});
//                 }
//                 else{
//                     res.send({status:200,success:true,message:"Detail Found", data:data});
//                 }
//             })
//         }
//     })(req,res,next)
// }

module.exports.getWeeklyRevenue = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_year = req.query.year;
            var my_month = req.query.month;

            // var query = `SELECT STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Sunday'), '%X%V %W') AS 'Week Start', 
            // STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Saturday'), '%X%V %W') AS 'Week End', 
            // SUM(product_price*product_quantity) AS revenue FROM orders,orderdetail 
            // WHERE orders.order_id=orderdetail.order_id and year(order_date) = ${my_year} and 
            // month(order_date) = ${my_month} and orders.statusId = 1 GROUP BY YEARWEEK(order_date) 
            // ORDER BY YEARWEEK(order_date)`;

            var my_query = `SELECT WEEK(order_date, 7) - WEEK(DATE_SUB(order_date, INTERVAL DAYOFMONTH(order_date) - 1 DAY), 7) + 1 as Time, 
            MONTH(order_date) as months, sum(product_price*product_quantity)as revenue from orders,orderdetail 
            where orders.order_id=orderdetail.order_id and year(order_date)= ${my_year} and 
            month(order_date) = ${my_month} and orders.statusId = 1 GROUP BY WEEK(order_date) `
            pool.query(my_query, function(err, data){
                if(err){
                    console.log(err);
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

module.exports.getTotalYearRevenue = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_query;
            my_query = ` SELECT SUM(orderdetail.product_quantity*orderdetail.product_price) as revenue FROM orders, 
            orderdetail where orders.order_id = orderdetail.order_id and orders.statusId=1
            `;
            pool.query(my_query, function(err, data){
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

module.exports.getYearMonthRevenue = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_query;
            var my_year = req.query.my_year;
            my_query = `select sum(product_price*product_quantity)as revenue from orders,orderdetail 
            where orders.order_id=orderdetail.order_id and year(order_date)= ${my_year};
            `;
            pool.query(my_query, function(err, data){
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


module.exports.getYearMonthWeekRevenue = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_query;
            var my_year = req.query.my_year;
            var my_month = req.query.my_month;
            my_query = `SELECT sum(product_price*product_quantity)as revenue from orders,orderdetail 
            where orders.order_id=orderdetail.order_id and year(order_date)= ${my_year} and 
            month(order_date) = ${my_month} and orders.statusId = 1
            `;
            pool.query(my_query, function(err, data){
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