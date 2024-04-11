var Category = require('../modal/category.modal');
const pool = require('../authorization/pool');
const passport = require('passport');

//Insert Api..

module.exports.insertCategory = function(req,res,next)
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
        var category = new Category(req.body);                
        if(!category.category_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Category Name.' });        
        }
        category.statusId=1;
        category.createdById = user[0].id;
        category.creationDate = new Date;
        Category.createCategory(category, function(err, data) 
        {
            if(err)
            {
                res.send({status:400,success:false,message:data.message});
            }
            else{
                res.send({status:200,success:true,message:data.message});
            }
        }); 
      
    }
    
  })(req,res,next)
}

//Update Category

module.exports.updateCategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var category = new Category(req.body);                 
        if(!req.body.category_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Category Id.' });        
        }
        else if(!category.category_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Category Name.' });        
        }        
        category.modifiedById = user[0].id;
        category.modificationDate = new Date;
        Category.updateCategory(req.body.category_id,category,function(err, data) 
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

//delete Category

module.exports.activateDeactivateCategory = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        //var category = new Category(req.query);
        var statusId = req.query.statusId;           
        Category.deleteCategory(req.query.category_id,statusId,function(err, data) 
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

//Get All Categories

module.exports.getAllCategories = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Category.getAllCategory(function(err,data){
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
  //})(req,res,next)
}
