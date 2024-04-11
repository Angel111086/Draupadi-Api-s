var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Subscription = function(subscription) {   
  this.subscription_email = subscription.subscription_email;
  this.statusId = subscription.statusId;
  this.createdById = subscription.createdById;  
  this.creationDate = subscription.creationDate;
  this.modifiedById = subscription.modifiedById;
  this.modificationDate = subscription.modificationDate;
};

Subscription.createSubscription = function (subscription, result) {       
    pool.query("INSERT INTO subscription SET ?", subscription, function (err, res) {
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

Subscription.getAllsubscription = function (result) {       
    pool.query("select * from subscription where statusId=1", function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

module.exports = Subscription;