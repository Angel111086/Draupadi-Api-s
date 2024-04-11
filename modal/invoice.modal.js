var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Invoice = function(invoice) {   
  this.order_id = invoice.order_id;
  this.shipping_id = invoice.shipping_id;  
  this.user_id = invoice.user_id;
  this.total_amount = invoice.total_amount;  
  this.amount_payable = invoice.amount_payable;    
  this.payment_mode = invoice.payment_mode;
  this.invoice_date = invoice.invoice_date;
  this.statusId = invoice.statusId;
  this.createdById = invoice.createdById;  
  this.creationDate = invoice.creationDate;
  this.modifiedById = invoice.modifiedById;
  this.modificationDate = invoice.modificationDate;
};

Invoice.createInvoice = function (invoice, result) {       
    pool.query("INSERT INTO invoice SET ?", invoice, function (err, res) {
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

module.exports = Invoice;