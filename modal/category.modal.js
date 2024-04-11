var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Category = function(category) {   
  this.category_name = category.category_name;
  this.statusId = category.statusId;
  this.createdById = category.createdById;  
  this.creationDate = category.creationDate;
  this.modifiedById = category.modifiedById;
  this.modificationDate = category.modificationDate;
};

Category.createCategory = function (category, result) {
    
    pool.query(`select category_name from category where category_name = '${category.category_name}'`,function(err,res){
        if(err){
            console.log("Select If",err);
        }
        else{
            try{               
                //if(new String(res[0].category_name).valueOf() === new String(category.category_name).valueOf()){
                if(res.length != 0){
                    result(err,{status:400,success:false,message:"Category Name is already saved."}) ;
                }
                else{
                    pool.query("INSERT INTO category SET ?", category, function (err, res) {
                    if(err) {
                        result(err, null);
                    }                
                    else{                               
                        result(null, {status:200,success:true,message:"Details Saved Successfully."});
                    }
                    });
                }
            }catch(e){console.log(e)}
        }
    });
           
};

Category.updateCategory = function (id,category,result) {       
    pool.query("update category SET category_name=?, modifiedById=?, modificationDate=? where category_id=?", 
    [category.category_name,category.modifiedById, category.modificationDate,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});

            }
        });           
};

Category.deleteCategory = function (id,statusId,result) {       
    pool.query("update category SET statusId=? where category_id=?", 
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

Category.getAllCategory = function (result) {       
    pool.query("select * from category where statusId=1", function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

module.exports = Category;