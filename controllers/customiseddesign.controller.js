var CustomisedDesign = require('../modal/customiseddesign.modal');
const passport = require('passport');
var jimp = require("jimp");
const pool = require('../authorization/pool');

module.exports.insertCustomisedDesign = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        console.log("IS Next", user);
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        {
        try
        {    
            if(!req.file){
                res.status(400).send({ success:false, message: 'Please Provide Design Image.' });        
            }
            else{ 
            var fn = './public/designs/' + req.file.filename;  
             jimp.read(fn, function (err, img) {
             if (err) 
                throw err;
                img.resize(250, 250)            // resize
                .quality(100)              // set JPEG quality       
                .write('./public/designs/' + fn) // save
                console.log('Resized !!')              
            });  
            var cd = new CustomisedDesign(req.body,fn);    
            console.log('CD', cd);      
                if(!cd.design_code){
                    return res.status(400).send({ success:false, message: 'Please Provide Design Code.' });        
                }
                if(!cd.price){
                    res.status(400).send({ success:false, message: 'Please Provide Price.' });        
                }
                cd.statusId=1;
                cd.createdById = user[0].id;
                cd.creationDate = new Date;
                CustomisedDesign.createCustomisedDesign(cd, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
            }    
        }catch(e){ console.log("catch",e);   }  }  
  })(req,res,next)
}


module.exports.updateCustomisedDesign = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {            
            console.log("User",err);
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user)
        {
        try
        {    
            if(!req.file)
            {
                
                var cd = new CustomisedDesign(req.body);
                console.log('Update CD', cd);    

                if(!cd.price){
                    res.status(400).send({ success:false, message: 'Please Provide Price.' });        
                }
                cd.statusId=1;
                cd.modifiedById = user[0].id;
                cd.modificationDate = new Date;
                CustomisedDesign.updateDesign(req.body.customised_designid,cd, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message});
                    }
                });
            }    
            
            else{ 
            var fn = './public/designs/' + req.file.filename;  
             jimp.read(fn, function (err, img) {
             if (err) 
                throw err;
                img.resize(250, 250)            // resize
                .quality(100)              // set JPEG quality       
                .write('./public/designs/' + fn) // save
                console.log('Resized !!')              
            });  
            var cd = new CustomisedDesign(req.body,fn);
            console.log('Update CD', cd);    

            if(!cd.price){
                res.status(400).send({ success:false, message: 'Please Provide Price.' });        
            }
            cd.statusId=1;
            cd.modifiedById = user[0].id;
            cd.modificationDate = new Date;
            CustomisedDesign.updateDesign(req.body.customised_designid,cd, function(err, data) 
            {
                if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                }
                else{
                    res.send({status:200,success:true,message:data.message});
                }
             });
            }    
        }catch(e){ console.log("catch",e);   }  }  
  })(req,res,next)
}


module.exports.enableDisableDesign = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        CustomisedDesign.enableDisableDesign(req.query.statusId,req.query.customised_designid,function(err, data) 
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

module.exports.deleteCustomisedDesign = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        CustomisedDesign.deleteDesign(req.query.customised_designid,function(err, data) 
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

module.exports.getAllCustomisedDesigns = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            CustomisedDesign.getAllDesign(function(err,data){
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
    //   }
  //})(req,res,next)
}


module.exports.getAllCustomisedDesignsById = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            CustomisedDesign.getAllDesignById(req.query.customised_designid,function(err,data){
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
    //   }
  //})(req,res,next)
}

module.exports.getAllCustomisedDesignsCount = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            CustomisedDesign.getDesignCount(function(err,data){
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
//        }
//   })(req,res,next)
}

module.exports.getCustomisedDesignPriceLowToHigh = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            CustomisedDesign.getDesignPriceLowToHigh(function(err,data){
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
//        }
//   })(req,res,next)
}

module.exports.getCustomisedDesignPriceHighToLow = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            CustomisedDesign.getDesignPriceHighToLow(function(err,data){
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
//        }
//   })(req,res,next)
}

module.exports.getRecentlyAddedCustomisedDesigns = function(req,res,next)
{
   // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            CustomisedDesign.getAllDesignByDate(function(err,data){
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
    //   }
  //})(req,res,next)
}