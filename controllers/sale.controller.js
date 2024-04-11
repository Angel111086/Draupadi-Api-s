// Need to display total quantity

const pool = require('../authorization/pool');
const passport = require('passport');


module.exports.getAllYearSale = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_query;
            // my_query = `
            // SELECT YEAR(ord.order_date) as Years,
            //                                 SUM(od.product_quantity) as product_quantity
            //                             FROM
            //                                 product p 
            //                             LEFT JOIN
            //                                 orderdetail od on p.product_id = od.product_id
            //                             LEFT JOIN
            //                                 orders ord on od.order_id = ord.order_id where ord.statusId=1
            //                             GROUP BY
            //                                 YEAR(ord.order_date)`;
            my_query = `
            SELECT YEAR(ord.order_date) as Time,
                                            SUM(od.product_quantity) as product_quantity
                                        FROM
                                            product p 
                                        LEFT JOIN
                                            orderdetail od on p.product_id = od.product_id
                                        LEFT JOIN
                                            orders ord on od.order_id = ord.order_id where ord.statusId=1
                                        GROUP BY
                                            YEAR(ord.order_date)`;
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

module.exports.getMonthlySale = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            my_year = req.query.year;
            my_product = req.query.product_name;
            var my_query;
            if(!my_product){
                my_query = `SELECT p.product_name, date_format(ord.order_date,'%b') as Time,
                                SUM(od.product_quantity) as product_quantity
                            FROM
                                product p 
                            LEFT JOIN
                                orderdetail od on p.product_id = od.product_id
                            LEFT JOIN
                                orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year} AND ord.statusId=1
                            GROUP BY
                                p.product_name`;
            }
            else{
                my_query = `SELECT p.product_name, date_format(ord.order_date,'%b') as Time,
                                SUM(od.product_quantity) as product_quantity
                            FROM
                                product p 
                            LEFT JOIN
                                orderdetail od on p.product_id = od.product_id
                            LEFT JOIN
                                orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year} AND p.product_name LIKE '%${my_product}%' AND ord.statusId=1
                            GROUP BY
                                p.product_name`;
            }
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


// module.exports.getMonthlySale = function(req, res, next){
//     passport.authenticate('jwt', function(err, user){
//         if (err || !user) 
//         {          
//             return res.json({ status: 401, success: false, message: "Authentication Fail." });
//         }
//         else if(user){
//             my_year = req.query.year;
//             my_month = req.query.month;
//             my_product = req.query.product_name;
//             var my_query;
//             if(!my_product){
//                 my_query = `SELECT p.product_name,
//                     SUM(od.product_quantity) as product_quantity
//                     FROM product p 
//                     LEFT JOIN
//                         orderdetail od on p.product_id = od.product_id
//                     LEFT JOIN
//                         orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year} 
//                         AND MONTH(ord.order_date) = ${my_month} AND ord.statusId=1
//                     GROUP BY
//                         p.product_name`

//             }
//             else{
//                 my_query = `SELECT p.product_name,
//                     SUM(od.product_quantity) as product_quantity
//                     FROM product p 
//                     LEFT JOIN
//                         orderdetail od on p.product_id = od.product_id
//                     LEFT JOIN
//                         orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year} 
//                         and MONTH(ord.order_date) = ${my_month} AND p.product_name LIKE '%${my_product}%' AND ord.statusId=1
//                     GROUP BY
//                         p.product_name`

//             }
//             console.log('Monthly Query', my_query);
//             pool.query(my_query, function(err, data){
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

module.exports.getWeeklySale = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            my_year = req.query.year;
            my_month = req.query.month;
            my_product = req.query.product_name;
            var my_query;
            if(!my_product){
                // my_query = `SELECT STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Sunday'), '%X%V %W') AS 'Week Start', 
                //             STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Saturday'), '%X%V %W') AS 'Week End', p.product_name,
                //             SUM(od.product_quantity) as product_quantity
                //             FROM product p 
                //             LEFT JOIN
                //                 orderdetail od on p.product_id = od.product_id
                //             LEFT JOIN
                //                 orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year} 
                //                 and MONTH(ord.order_date) = ${my_month} AND ord.order_date >= YEARWEEK(ord.order_date) AND ord.statusId=1
                //             GROUP BY
                //                 p.product_name`;

                my_query = `SELECT WEEK(order_date, 7) - WEEK(DATE_SUB(order_date, INTERVAL DAYOFMONTH(order_date) - 1 DAY), 7) + 1 as Time, 
                            MONTH(order_date) as months, p.product_name,
                            SUM(od.product_quantity) as product_quantity
                            FROM product p 
                            LEFT JOIN
                                orderdetail od on p.product_id = od.product_id
                            LEFT JOIN
                                orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year}
                                and MONTH(ord.order_date) = ${my_month} AND ord.order_date >= YEARWEEK(ord.order_date) 
                                AND ord.statusId=1
                            GROUP BY
                                p.product_name`;
            }
            else{
                // my_query = `SELECT STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Sunday'), '%X%V %W') AS 'Week Start', 
                //             STR_TO_DATE(CONCAT(YEARWEEK(order_date, 0), ' ', 'Saturday'), '%X%V %W') AS 'Week End', p.product_name,
                //             SUM(od.product_quantity) as product_quantity
                //             FROM product p 
                //             LEFT JOIN
                //                 orderdetail od on p.product_id = od.product_id
                //             LEFT JOIN
                //                 orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year} 
                //                 and MONTH(ord.order_date) = ${my_month} AND p.product_name LIKE '%${my_product}%'
                //                 ord.order_date >= YEARWEEK(ord.order_date) AND ord.statusId=1
                //             GROUP BY
                //                 p.product_name`

                
                my_query = `SELECT WEEK(order_date, 7) - WEEK(DATE_SUB(order_date, INTERVAL DAYOFMONTH(order_date) - 1 DAY), 7) + 1 as Time, 
                            MONTH(order_date) as months, p.product_name,
                            SUM(od.product_quantity) as product_quantity
                            FROM product p 
                            LEFT JOIN
                                orderdetail od on p.product_id = od.product_id
                            LEFT JOIN
                                orders ord on od.order_id = ord.order_id where YEAR(ord.order_date) = ${my_year}
                                and MONTH(ord.order_date) = ${my_month} AND p.product_name LIKE '%${my_product}%'
                                and ord.order_date >= YEARWEEK(ord.order_date) AND ord.statusId=1
                            GROUP BY
                                p.product_name`;


            }
            pool.query(my_query, function(err, data){
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

module.exports.getTotalYearSales = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_query;
            my_query = `SELECT SUM(od.product_quantity) as product_quantity_total
                        FROM
                            product p 
                        LEFT JOIN
                            orderdetail od on p.product_id = od.product_id
                        LEFT JOIN
                        orders ord on od.order_id = ord.order_id where ord.statusId=1`;
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

module.exports.getYearMonthSales = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_query;
            var my_year = req.query.my_year;
            my_query = `SELECT SUM(od.product_quantity) as product_quantity
                        FROM
                            product p 
                        LEFT JOIN
                            orderdetail od on p.product_id = od.product_id
                        LEFT JOIN
                            orders ord on od.order_id = ord.order_id 
                            where YEAR(ord.order_date) = ${my_year} AND ord.statusId=1`;
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

module.exports.getYearMonthWeekSales = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_query;
            var my_year = req.query.my_year;
            var my_month = req.query.my_month;
            my_query = `SELECT SUM(od.product_quantity) as product_quantity 
                        FROM 
                            product p 
                        LEFT JOIN 
                            orderdetail od on p.product_id = od.product_id 
                        LEFT JOIN 
                            orders ord on od.order_id = ord.order_id 
                        where YEAR(ord.order_date) = ${my_year} and MONTH(ord.order_date) = ${my_month}
                        AND ord.order_date >= YEARWEEK(ord.order_date) AND ord.statusId=1;`;
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

module.exports.getTopFourProduct = function(req, res, next){
    passport.authenticate('jwt', function(err, user){
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){
            var my_query;
            my_query = `
                SELECT product_name, SUM(od.product_quantity) as product_quantity_total
                FROM
                    product p 
                LEFT JOIN
                    orderdetail od on p.product_id = od.product_id
                LEFT JOIN
                    orders ord on od.order_id = ord.order_id 
                where 
                    ord.statusId=1 
                group by product_name 
                order by sum(od.product_quantity) desc 
                limit 4;`;
            pool.query(my_query, function(err, data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length == 0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                }
                else{                    
                    calculatePercentage(res,data);
                }
            })
        }
    })(req,res,next)
}

function calculatePercentage(res, data){
    var totalProducts = 0;
    for(i=0;i<data.length;i++){        
        var x = data[i].product_quantity_total;
        console.log('I', x);
        totalProducts = totalProducts + x;
    }
        var percentage = [];
        var count = 0;
        var completeData = [];
        var jsonData = {};
        for(j=0;j<data.length;j++){
            var per = data[j].product_quantity_total;
            percentage[j] = per * 100 / totalProducts;
            console.log('Total Products', percentage[j].toFixed(2));
            completeData.push({
                "product_name" : data[j].product_name,
                "product_quantity": data[j].product_quantity_total,
                "percentage" : percentage[j].toFixed(2)});
            console.log('CD', completeData);

        }
        jsonData.completeData = completeData;
        res.send({status:200,success:true,message:"Detail Found", data:jsonData}); 
        
    
}