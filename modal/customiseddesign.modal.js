var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const CustomisedDesign = function(customiseddesign, file) {     
  this.design_code = customiseddesign.design_code;
  this.price = customiseddesign.price;
  this.designimage = file;
  this.statusId = customiseddesign.statusId;
  this.createdById = customiseddesign.createdById;  
  this.creationDate = customiseddesign.creationDate;
  this.modifiedById = customiseddesign.modifiedById;
  this.modificationDate = customiseddesign.modificationDate;
};

CustomisedDesign.createCustomisedDesign = function (customiseddesign, result) {       
    pool.query("INSERT INTO customised_design SET ?", customiseddesign, function (err, res) {
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


CustomisedDesign.updateDesign = function(id,cd,result) {
    var update_query, value;
    pool.query(`select * from customised_design where customised_designid=${id}`,function(err, data){
        if(err){
            console.log(err);
            result(err, null);
        }
        else{
            console.log(data.length);
            if(data.length>0)
            {
                if(cd.designimage !== undefined){
                    update_query = `update customised_design SET price=?, designimage=?, modifiedById=?, 
                    modificationDate=? where customised_designid=?`;

                    value = [cd.price, cd.designimage,cd.modifiedById, cd.modificationDate, id];
                }
                else{
                    update_query = `update customised_design SET price=?, modifiedById=?, 
                    modificationDate=? where customised_designid=?`;

                    value = [cd.price,cd.modifiedById, cd.modificationDate, id];
                }
                pool.query(update_query, value, function (err, res) 
                {
                    if(err) 
                    {
                        console.log(err);
                        result(err, null);
                    }
                    else
                    {                       
                            result(null, {status:200,success:true,message:"Details Updated Successfully."});
            
                    }
                });

            }

        }
    });
           
};

CustomisedDesign.enableDisableDesign = function (statusId,id,result) {       
    pool.query("update customised_design SET statusId=? where customised_designid=?", 
    [statusId,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Successfully Done."});

            }
        });           
};

CustomisedDesign.deleteDesign = function (id,result) {       
    pool.query("delete from customised_design where customised_designid=?", 
    [id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Data Successfully Deleted."});

            }
        });           
};


CustomisedDesign.getAllDesign = function (result) {       
    pool.query("select * from customised_design order by customised_designid DESC", function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


CustomisedDesign.getAllDesignById = function (id,result) {       
    pool.query("select * from customised_design where customised_designid = ? and statusId=1",[id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


CustomisedDesign.getDesignCount = function (result) {       
    pool.query(`select count(*) as Total from customised_design Where statusId=1`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

CustomisedDesign.getDesignPriceLowToHigh = function (result) {       
    pool.query(`SELECT * FROM customised_design where statusId=1 ORDER BY price ASC`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

CustomisedDesign.getDesignPriceHighToLow = function (result) {       
    pool.query(`SELECT * FROM customised_design where statusId=1 ORDER BY price DESC`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

CustomisedDesign.getAllDesignByDate = function (result) {       
    pool.query("select * from customised_design where statusId=1 order by creationDate DESC", function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};
module.exports = CustomisedDesign;