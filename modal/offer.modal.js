var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Offer = function(offer) {   
  this.offer_name = offer.offer_name;
  this.offer_code = offer.offer_code;  
  this.no_of_users = offer.no_of_users;  
  this.fromDate = offer.fromDate;  
  this.expiryDate = offer.expiryDate;  
  this.minimum_cartvalue = offer.minimum_cartvalue;  
  this.maximumDiscount = offer.maximumDiscount;  
  this.discountType = offer.discountType;  
  this.discount = offer.discount;  
  this.category_id = offer.category_id;  
  //this.subcategory_id = offer.subcategory_id;  
  //this.product_id = offer.product_id;  
  this.offer_description = offer.offer_description;  
  this.statusId = offer.statusId;
  this.createdById = offer.createdById;  
  this.creationDate = offer.creationDate;
  this.modifiedById = offer.modifiedById;
  this.modificationDate = offer.modificationDate;
};

Offer.createOffer = function (offer, result) {       
    pool.query("INSERT INTO offer SET ?", offer, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);         
                result(null, {status:200,success:true,message:"Details Saved Successfully.", id:res.insertId});

            }
        });           
};

Offer.updateOffer = function (id,offer,result) {       
    pool.query(`update offer SET offer_name=?, offer_code=?, no_of_users=?, fromDate=?, expiryDate=?, minimum_cartvalue=?,
    maximumDiscount=?, discountType=?, discount=?, category_id=?, offer_description=?,
     modifiedById=?, modificationDate=? where offer_id=?`, 
    [offer.offer_name, offer.offer_code, offer.no_of_users,offer.fromDate, offer.expiryDate, offer.minimum_cartvalue,
        offer.maximumDiscount, offer.discountType, offer.discount, offer.category_id, 
        offer.offer_description,offer.modifiedById, offer.modificationDate,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});

            }
        });           
};



Offer.enableDisableOffer = function (id,statusId,result) {           
    pool.query("update offer set statusId=? where offer_id=?", 
    [statusId,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details deleted Successfully."});

            }
        });           
};

Offer.deleteOffer = function (id,result) {           
    pool.query("delete from offer where offer_id=?", 
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

Offer.getAllOffer = function (result) {       
    //Previous

//     `select off.*, cate.category_name, sub.subcategory_name, pro.product_name
//     from offer off
//    LEFT JOIN category as cate ON(off.category_id = cate.category_id)
//    LEFT JOIN subcategory as sub ON(off.subcategory_id = sub.subcategory_id)
//    LEFT JOIN product as pro ON(off.product_id = pro.product_id)`

    pool.query(`select off.*, cate.category_name from offer off
                LEFT JOIN category as cate ON(off.category_id = cate.category_id)`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Offer.totalOffer = function (result) {       
    pool.query(`select count(*) as Total from offer where statusId=1`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


Offer.getActiveOffer = function (result) {       
    pool.query(`select offer_code, offer_description from offer where statusId=1`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Offer.getOfferByCode = function (code,result) {       

    pool.query(`select off.*, cate.category_id,cate.category_name from offer off
                LEFT JOIN category as cate ON(off.category_id = cate.category_id)
                where off.offer_code='${code}' and off.statusId=1`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

module.exports = Offer;