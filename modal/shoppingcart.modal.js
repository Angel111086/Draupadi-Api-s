var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const ShoppingCart = function(shoppingcart) {   
  this.user_id = shoppingcart.user_id;
  this.product_id = shoppingcart.product_id;
  this.product_name = shoppingcart.product_name;
  this.product_price = shoppingcart.product_price;
  this.product_discount = shoppingcart.product_discount;
  this.product_actualprice = shoppingcart.product_actualprice;
  this.product_image = shoppingcart.product_image;
  this.product_quantity = shoppingcart.product_quantity;
  this.dateAdded = shoppingcart.dateAdded;
  this.customised_designid = shoppingcart.customised_designid;
  this.design_code = shoppingcart.design_code;
  this.design_price = shoppingcart.design_price;
  this.designimage = shoppingcart.designimage;
  this.offer_id = shoppingcart.offer_id;
  this.offerdiscount = shoppingcart.offerdiscount;
  this.length = shoppingcart.length;
  this.breadth = shoppingcart.breadth;
  this.height = shoppingcart.height;
  this.weight = shoppingcart.weight;
  this.statusId = shoppingcart.statusId;
  this.createdById = shoppingcart.createdById;  
  this.creationDate = shoppingcart.creationDate;
  this.modifiedById = shoppingcart.modifiedById;
  this.modificationDate = shoppingcart.modificationDate;
};

ShoppingCart.createShoppingCart = function (shoppingcart, result) {       
    pool.query("INSERT INTO shopping_cart SET ?", [shoppingcart], function (err, res) {
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


// ShoppingCart.updateShoppingCart = function (shoppingcart,id,result) {       
//     pool.query(`update shopping_cart SET product_quantity=?, modifiedById=?, modificationDate=? where cart_id=?`, 
//     [shoppingcart.product_quantity, 
//         shoppingcart.modifiedById, shoppingcart.modificationDate,id], function (err, res) {
//             if(err) {
//                 console.log(err);
//                 result(err, null);
//             }
//             else{                       
//                 result(null, {status:200,success:true,message:"Details Updated Successfully."});

//             }
//         });           
// };

ShoppingCart.deleteShoppingCart = function (id,result) {           
    pool.query("delete from shopping_cart WHERE cart_id=?",
    [id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details deleted Successfully."});

            }
        });           
};

ShoppingCart.getAllCartItems = function (id,result) {           
    pool.query("select * from shopping_cart WHERE user_id=?",
    [id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:res});

            }
        });           
};

module.exports = ShoppingCart;