var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Orders = function(orders) {   
  this.user_id = orders.user_id;
  this.shiprocket_orderid = orders.shiprocket_orderid;
  this.shiprocket_shipmentid= orders.shiprocket_shipmentid;
  this.totalAmount = orders.totalAmount;
  this.discount = orders.discount;
  this.payableAmount = orders.payableAmount;
  this.shipping_id = orders.shipping_id;
  this.status = orders.status;
  this.payment_type = orders.payment_type;
  this.order_date = orders.order_date;
  this.statusId = orders.statusId;
  this.createdById = orders.createdById;  
  this.creationDate = orders.creationDate;
  this.modifiedById = orders.modifiedById;
  this.modificationDate = orders.modificationDate;
};

Orders.createOrders = function (orders, result) {       
    pool.query("INSERT INTO orders SET ?", orders, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);    
                pool.query(`select * from orders where order_id=${res.insertId}`, function(err, data){
                    if(err){
                        console.log(err);
                        result(err, null);
                    }
                    else{     
                        result(null, {status:200,success:true,message:"Details Saved Successfully.",id: data});
                    }
                });
            }
        });           
};

Orders.updateOrders = function (id,orders,result) {       
    pool.query(`update orders SET totalAmount=?, discount=?, payableAmount=?, shipping_id=?, status=?,
    payment_type=?, order_date=?, modifiedById=?, modificationDate=? where order_id=?`, 
    [orders.totalAmount, orders.discount,orders.payableAmount, orders.shipping_id, 
       orders.status, orders.payment_type, orders.order_date, orders.modifiedById, orders.modificationDate,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});

            }
        });           
};

Orders.deleteOrders = function (id,orders,result) {       
    pool.query("update orders SET statusId=? where order_id=?", 
    [orders.statusId,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details deleted Successfully."});

            }
        });           
};

Orders.getAllOrders = function (result) {       
    pool.query(`select us.user_name,detail.product_id,detail.product_quantity,
                    detail.product_price, pro.product_name, ord.* from orders as ord
                    LEFT JOIN user as us ON(ord.user_id = us.user_id)
                    LEFT JOIN orderdetail as detail ON(ord.order_id = detail.order_id) 
                    LEFT JOIN product as pro ON(detail.product_id = pro.product_id) 
                    Where ord.statusId=1 Order By ord.order_id DESC;`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Orders.getAllOrdersByUser = function (user_id,result) {       
    pool.query(`select * from orders Where statusId=1 and user_id=${user_id}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);
            }
        });           
};

Orders.getAllOrdersByDate = function (from_date,to_date,result) {  
    //var query=`SELECT * from orders WHERE date_column >= '${from_date} 00:00:00' AND date_column <= '${to_date} 23:59:59';`;     
   
    pool.query(`select * from orders Where statusId=1 
    and order_date between '${from_date} 00:00:00' and '${to_date} 00:00:00'`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);
            }
        });           
};

function addDays(date) {    
    var result = new Date(date);
    result.setDate(result.getDate() + 1);
    return result;   
}

Orders.getOrdersByUserId = function (user_id,result) {       
    pool.query(`select us.user_name,ord.* from orders as ord
    LEFT JOIN user as us ON(ord.user_id = us.user_id) 
    Where ord.statusId=1 and  ord.user_id=${user_id}
    Order By ord.order_date DESC`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);
            }
        });           
};


Orders.getOrdersOfUser = function (user_id,result) {       
    pool.query(`select us.user_name,ord.* from orders as ord
    LEFT JOIN user as us ON(ord.user_id = us.user_id) 
    Where ord.statusId=1 and  ord.user_id=${user_id}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);
            }
        });           
};

Orders.updateShipRocketDetails = function (id,ord,result) {       
    pool.query(`update orders set shiprocket_orderid=?, shiprocket_shipmentid=?
                where order_id=?`,[ord.shiprocket_orderid, ord.shiprocket_shipmentid, id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});
            }
        });           
};
module.exports = Orders;