var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const OrderDetail = function(orderdetail) {   
  this.order_id = orderdetail.order_id;
  this.product_id = orderdetail.product_id;
  this.product_quantity = orderdetail.product_quantity;
  this.product_price = orderdetail.product_price; 
  this.offer_id = orderdetail.offer_id;
  this.customised_designid = orderdetail.customised_designid;
  this.design_code  = orderdetail.design_code;
  this.price  = orderdetail.price;
  this.statusId = orderdetail.statusId;
  this.createdById = orderdetail.createdById;
  this.creationDate = orderdetail.creationDate;
  this.modifiedById = orderdetail.modifiedById;
  this.modificationDate = orderdetail.modificationDate;
};

OrderDetail.createOrderDetail = function (orderdetail, result) {       
    pool.query("INSERT INTO orderdetail SET ?", [orderdetail], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);         
                result(null, {status:200,success:true,message:"Details Saved Successfully."});

            }
        });           
};

OrderDetail.updateOrderDetail = function (id,orderdetail,result) {       
    pool.query(`update orderdetail SET product_id=?, product_quantity=?,
    product_price=?, modifiedById=?, modificationDate=? where orderdetail_id=?`, 
    [orderdetail.product_id, orderdetail.product_quantity,orderdetail.product_price, 
        orderdetail.modifiedById, orderdetail.modificationDate,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});

            }
        });           
};

OrderDetail.deleteOrderDetail = function (id,orderdetail,result) {       
    console.log('OD',orderdetail.statusId, id);
    pool.query("update orderdetail SET statusId=? where orderdetail_id=?", 
    [orderdetail.statusId,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details deleted Successfully."});

            }
        });           
};

//By User and Order Id
OrderDetail.getAllOrderDetail = function (user_id,result) {       
    pool.query(`select pro.*, od.product_id, ord.order_id, ord.order_date from product as pro
                LEFT JOIN orderdetail as od ON(pro.product_id = od.product_id)
                LEFT JOIN orders as ord ON(ord.order_id = od.order_id)
                Where od.statusId=1 and ord.user_id=?`, [user_id],function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

module.exports = OrderDetail;