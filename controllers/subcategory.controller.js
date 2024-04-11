var Subcategory = require('../modal/subcategory.modal');
const pool = require('../authorization/pool');
const passport = require('passport');

//insert Api.
module.exports.insertSubcategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){               
        var subcategory = new Subcategory(req.body);                
        if(!subcategory.subcategory_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Subcategory Name.' });        
        }
        else if(!subcategory.category_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Category Name.' });        
        }
        subcategory.statusId=1;
        subcategory.createdById = user[0].id;
        subcategory.creationDate = new Date;
        Subcategory.createSubcategory(subcategory, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        });
    }    
  })(req,res,next)
}

//Update Subcategory

module.exports.updateSubcategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var subcategory = new Subcategory(req.body);                 
        if(!req.body.subcategory_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Subcategory Id.' });        
        }
        else if(!subcategory.subcategory_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Subcategory Name.' });        
        }        
        subcategory.modifiedById = user[0].id;
        subcategory.modificationDate = new Date;
        Subcategory.updateSubcategory(req.body.subcategory_id,subcategory,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//delete Subategory

module.exports.activateDeactivateSubcategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        //var subcategory = new Subcategory(req.query);
        var statusId = req.query.statusId;           
        Subcategory.deleteSubcategory(req.query.subcategory_id,statusId,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }           
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//Get All Subctegories by category Id

module.exports.getAllSubcategoriesByCategory = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Subcategory.getAllSubcategoryByCategoryId(req.query.category_id,function(err,data){
                if(err){
                    res.send({status:400,success:false,message:"No Detail Found"});
                }
                else if(data.length==0){
                    res.send({status:200,success:true,message:"No Detail Available"});
                } 
                else{
                    res.send({status:200,success:true,message:
                    "Detail Found", data:data});
                }
            });
      // }
 // })(req,res,next)
}