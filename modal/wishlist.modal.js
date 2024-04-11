var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Wishlist = function(wishlist) {   
  this.wishlist_name = wishlist.wishlist_name;
  this.wishlist_description = wishlist.wishlist_description;
  this.user_id = wishlist.user_id;
  this.product_id = wishlist.product_id;
  this.statusId = wishlist.statusId;
  this.createdById = wishlist.createdById;
  this.creationDate = wishlist.creationDate;
  this.modifiedById = wishlist.modifiedById;
  this.modificationDate = wishlist.modificationDate;
};

// Wishlist.createWishlist = function (wishlist, result) {       
//     pool.query("INSERT INTO wishlist SET ?", [wishlist], function (err, res) {
//             if(err) {
//                 console.log(err);
//                 result(err, null);
//             }
//             else{
//                 console.log(res.insertId);         
//                 result(null, {status:200,success:true,message:"Details Saved Successfully."});

//             }
//         });           
// };


Wishlist.createWishlist = function (wishlist, result) {       
    pool.query("INSERT INTO wishlist SET ?", wishlist, function (err, res) {
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


Wishlist.updateWishlist = function (id,wishlist,result) {       
    pool.query(`update wishlist SET wishlist_name=?,product_id=?, modifiedById=?, modificationDate=? where wishlist_id=?`, 
    [wishlist.wishlist_name,wishlist.product_id, wishlist.modifiedById, wishlist.modificationDate,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});

            }
        });           
};

Wishlist.deleteWishlist = function (id,result) {       
    pool.query("delete from wishlist where wishlist_id=?", 
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

//By User Id
Wishlist.getAllWishlist = function (user_id,result) {       
    pool.query(`select product.*, wish.wishlist_name,wish.wishlist_description,wish.wishlist_id 
                from product as product
                LEFT JOIN wishlist as wish ON(product.product_id = wish.product_id)  
                Where product.statusId=1 and wish.user_id=?`, [user_id],function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


module.exports = Wishlist;