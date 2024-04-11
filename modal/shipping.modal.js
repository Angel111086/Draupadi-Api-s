var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Shipping = function(shipping) {   
  this.user_id = shipping.user_id;
  this.first_name = shipping.first_name;
  this.last_name = shipping.last_name;
  this.address_line1 = shipping.address_line1;
  this.address_line2 = shipping.address_line2;
  this.landmark = shipping.landmark;
  this.state_name = shipping.state_name;
  this.city = shipping.city;
  this.postalcode = shipping.postalcode;
  this.mobilenumber = shipping.mobilenumber;
  this.address_type = shipping.address_type;
  this.statusId = shipping.statusId;
  this.createdById = shipping.createdById;  
  this.creationDate = shipping.creationDate;
  this.modifiedById = shipping.modifiedById;
  this.modificationDate = shipping.modificationDate;
};

Shipping.createShipping = function (shipping, result) {       
    pool.query("INSERT INTO shippingaddress SET ?", [shipping], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);         
                result(null, {status:200,success:true,message:"Details Saved Successfully.", id: res.insertId});

            }
        });           
};

Shipping.updateShipping = function (id,shipping,result) {       
    pool.query(`update shippingaddress SET address_line1=?, address_line2=?, landmark=?,
    city=?, postalcode=?,mobilenumber=?, address_type=?, modifiedById=?, modificationDate=? where shipping_id=?`, 
    [shipping.address_line1, shipping.address_line2,shipping.landmark,shipping.city, shipping.postalcode,
        shipping.mobilenumber, shipping.address_type, shipping.modifiedById, 
        shipping.modificationDate,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});

            }
        });           
};

Shipping.deleteShipping = function (id,shipping,result) {           
    pool.query("update shippingaddress SET statusId=? where shipping_id=?", 
    [shipping.statusId,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details deleted Successfully."});

            }
        });           
};

Shipping.getAllShipping = function (user_id,result) {       
    pool.query("select * from shippingaddress Where statusId=1 and user_id=?",[user_id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Shipping.getShippingById = function (shipping_id,result) {       
    pool.query("select * from shippingaddress Where statusId=1 and shipping_id=?",[shipping_id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

module.exports = Shipping;