var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Subcategory = function(subcategory) {   
  this.subcategory_name = subcategory.subcategory_name;
  this.category_id = subcategory.category_id;
  this.statusId = subcategory.statusId;
  this.createdById = subcategory.createdById;  
  this.creationDate = subcategory.creationDate;
  this.modifiedById = subcategory.modifiedById;
  this.modificationDate = subcategory.modificationDate;
};

Subcategory.createSubcategory = function (subcategory, result) {
    pool.query(`select subcategory_name from subcategory where subcategory_name = '${subcategory.subcategory_name}'`,function(err,res){
        if(err){
            console.log("Select If",err);
        }
        else{
            try{           
                if(res.length != 0){
                    result(err,{status:400,success:false,message:"Subcategory Name is already saved."}) ;
                }
                else{     
                    pool.query("INSERT INTO subcategory SET ?", subcategory, function (err, res) {
                    if(err) {
                            console.log(err);
                            result(err, null);
                    }
                    else{
                        console.log(res.insertId);         
                        result(null, {status:200,success:true,message:"Details Saved Successfully."});
                    }
                });
            }
        }catch(e){console.log(e)}
    }
});           
}

Subcategory.updateSubcategory = function (id,subcategory,result) {       
    pool.query(`update subcategory SET subcategory_name=?, modifiedById=?, 
    modificationDate=? where subcategory_id=?`, 
    [subcategory.subcategory_name,subcategory.modifiedById, subcategory.modificationDate,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});

            }
        });           
};

Subcategory.deleteSubcategory = function (id,statusId,result) {       
    pool.query("update subcategory SET statusId=? where subcategory_id=?", 
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

Subcategory.getAllSubcategoryByCategoryId = function (category_id, result) {       
    pool.query("select * from subcategory Where category_id=?", 
                [category_id],function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

module.exports = Subcategory;