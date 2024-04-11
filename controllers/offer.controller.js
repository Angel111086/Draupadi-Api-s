var Offer = require('../modal/offer.modal');
const passport = require('passport');

const cron = require('node-cron');
const pool = require('../authorization/pool');

//insert Api. Admin Token
module.exports.insertOffer = function(req,res,next)
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
        var offer = new Offer(req.body);      
        console.log("Offer", req.body);          
        if(!offer.offer_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Offer Name.' });        
        }
        if(!offer.offer_code)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Offer Code.' });        
        }
        if(!offer.no_of_users)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Number of Users.' });        
        }
        if(!offer.fromDate)
        {
            return res.status(400).send({ error:true, message: 'Please Provide From Date.' });        
        }
        if(!offer.expiryDate)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Expiry Date' });        
        }
        if(!offer.minimum_cartvalue)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Minimum Cart Value.' });        
        }
        if(!offer.maximumDiscount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Maximum Discount.' });        
        }
        if(!offer.discountType)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Discount Type.' });        
        }
        if(!offer.discount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Discount.' });        
        }
        if(!offer.category_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Category' });        
        }
        // if(!offer.subcategory_id)
        // {
        //     return res.status(400).send({ error:true, message: 'Please Provide Subcategory.' });        
        // }
        // if(!offer.product_id)
        // {
        //     return res.status(400).send({ error:true, message: 'Please Provide Product.' });        
        // }        
        offer.statusId=0;
        offer.createdById = user[0].id;
        offer.creationDate = new Date;
        var fd = offer.fromDate;
        var td = offer.expiryDate;
        Offer.createOffer(offer, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
             
                res.send({status:200,success:true,message:data.message});
                console.log(fd);
                fromStartSchedule(fd, data.id);
                fromStopSchedule(td, data.id);
            }
        });
    }    
  })(req,res,next)
}

// function fromStartSchedule(offer_date, offer_id){
//     var newDate = offer_date.split('-').reverse().join('.');
//     console.log('New Date', newDate);
//     var vals = newDate.split('.');
//     // var day = vals[0];
//     // var month = vals[1];
//     // var year = vals[2];    

//     var day = 07;
//     var month = 02;
//     console.log('Day', day);
//     console.log('Month', month);
//     const task = cron.schedule(`* 33 11 ${day} ${month} *`, () => {
//         console.log('running a task every two hours between 8 a.m. and 5:58 p.m.');
//         pool.query(`update offer set statusId=1 where offer_id=${offer_id}`, function(err,data){
//                 if(err){
//                     console.log('Something went wrong');
//                 }
//                 else{
//                     console.log('Offer Activated');
//                 }
//         });
//       });
//       task.start();
// }

function fromStartSchedule(offer_date, offer_id){
    var newDate = offer_date.split('-').reverse().join('.');
    console.log('New Date', newDate);
    var vals = newDate.split('.');
    var day = vals[0];
    var month = vals[1];
    var year = vals[2];    

    // var day = 07;
    // var month = 02;
    console.log('Day', day);
    console.log('Month', month);
    const task = cron.schedule(`* 31 18 ${day} ${month} *`, () => {
        console.log('Task Started');
        pool.query(`update offer set statusId=1 where offer_id=${offer_id}`, function(err,data){
                if(err){
                    console.log('Something went wrong' + err);
                }
                else{
                    console.log('Offer Activated');
                }
        });
      });
      task.start();
}

function fromStopSchedule(offer_date, offer_id){
    var newDate = offer_date.split('-').reverse().join('.');
    console.log('New Date', newDate);
    var vals = newDate.split('.');
    var day = vals[0];
    var month = vals[1];
    var year = vals[2];    

    // var day = 07;
    // var month = 02;
    console.log('Day', day);
    console.log('Month', month);
    const task = cron.schedule(`* 31 18 ${day} ${month} *`, () => {
        console.log('Task Started');
        pool.query(`update offer set statusId=0 where offer_id=${offer_id}`, function(err,data){
                if(err){
                    console.log('Something went wrong' + err);
                }
                else{
                    console.log('Offer Deactivated');
                }
        });
      });
      task.start();
}




//Update Offer

module.exports.updateOffer = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){        
        var offer = new Offer(req.body);            
        if(!offer.offer_name)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Offer Name.' });        
        }
        if(!offer.offer_code)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Offer Code.' });        
        }
        if(!offer.no_of_users)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Number of Users.' });        
        }
        if(!offer.fromDate)
        {
            return res.status(400).send({ error:true, message: 'Please Provide From Date.' });        
        }
        if(!offer.expiryDate)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Expiry Date' });        
        }
        if(!offer.minimum_cartvalue)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Minimum Cart Value.' });        
        }
        if(!offer.maximumDiscount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Maximum Discount.' });        
        }
        if(!offer.discountType)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Discount Type.' });        
        }
        if(!offer.discount)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Discount.' });        
        }
        if(!offer.category_id)
        {
            return res.status(400).send({ error:true, message: 'Please Provide Category' });        
        }
        // if(!offer.subcategory_id)
        // {
        //     return res.status(400).send({ error:true, message: 'Please Provide Subcategory.' });        
        // }
        // if(!offer.product_id)
        // {
        //     return res.status(400).send({ error:true, message: 'Please Provide Product.' });        
        // }       
        offer.modifiedById = user[0].id;
        offer.modificationDate = new Date;
        var fd = offer.fromDate;
        var td = offer.expiryDate;
        Offer.updateOffer(req.body.offer_id,offer,function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message:data.message});
                console.log(fd);
                fromStartSchedule(fd, req.body.offer_id );
                fromStopSchedule(td, req.body.offer_id );
            }
        }); 
      
    }
    
  })(req,res,next)
}

//delete Offer

module.exports.deleteOffer = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        //var offer = new Offer(req.query);          
        Offer.deleteOffer(req.query.offer_id,function(err, data) 
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

//Get All Orders

module.exports.getAllOffers = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Offer.getAllOffer(function(err,data){
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


module.exports.activateDeactivateOffer = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        var statusId = req.query.statusId;           
        Offer.enableDisableOffer(req.query.offer_id,statusId,function(err, data) 
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


module.exports.getTotalOffers = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){         
        Offer.totalOffer(function(err, data) 
        {
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
      
    }
  })(req,res,next)
}

module.exports.getActiveOffers = function(req,res,next)
{
            Offer.getActiveOffer(function(err,data){
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
}

module.exports.getOfferByCode = function(req,res,next)
{
            Offer.getOfferByCode(req.query.code,function(err,data){
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
}