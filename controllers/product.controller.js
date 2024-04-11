var Product = require('../modal/product.modal');
const passport = require('passport');
var jimp = require("jimp");
const pool = require('../authorization/pool');

module.exports.insertProduct = function(req,res,next)
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
                res.status(400).send({ success:false, message: 'Please Provide Product Image.' });        
            }
            else{ 
            var fn = './public/product/' + req.file.filename;  
            //let newfileName = req.file.filename + ".png"
             jimp.read(fn, function (err, img) {
             if (err) 
                throw err;
                img.resize(250, 250)            // resize
                .quality(100)              // set JPEG quality       
                .write('./public/product/' + fn) // save
                console.log('Resized !!')              
            });  
            var product = new Product(req.body,fn);    
            console.log('Pro', product);      
                if(!product.category_id){
                    return res.status(400).send({ success:false, message: 'Please Provide Category Name.' });        
                }
                if(!product.subcategory_id){
                    res.status(400).send({ success:false, message: 'Please Provide Subcategory Name.' });        
                }
                if(!product.product_name){
                    res.status(400).send({ success:false, message: 'Please Provide Product Name.' });        
                }
                if(!product.product_price){
                    res.status(400).send({ success:false, message: 'Please Provide Product Price.' });        
                }
                if(!product.product_discount){
                    res.status(400).send({ success:false, message: 'Please Provide Product Discount.' });        
                }
                if(!product.product_actualprice){
                    res.status(400).send({ success:false, message: 'Please Provide Product Actual Price.' });        
                }               
                product.statusId=1;
                product.createdById = user[0].id;
                product.creationDate = new Date;
                Product.createProduct(product, function(err, data) 
                {
                    if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                    }
                    else{
                        res.send({status:200,success:true,message:data.message, product_id: data.id});
                    }
                });
            }    
        }catch(e){ console.log("catch",e);   }  }  
  })(req,res,next)
}

//update Product Api..
module.exports.updateProduct = function(req,res,next)
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
                //res.status(400).send({ success:false, message: 'Please Provide Product Image.' });
                
                var product = new Product(req.body);
                console.log('Product', product);    

                if(!product.product_name){
                    res.status(400).send({ success:false, message: 'Please Provide Product Name.' });        
                }
                if(!product.product_price){
                    res.status(400).send({ success:false, message: 'Please Provide Product Price.' });        
                }
                if(!product.product_discount){
                    res.status(400).send({ success:false, message: 'Please Provide Product Discount.' });        
                }
                if(!product.product_actualprice){
                    res.status(400).send({ success:false, message: 'Please Provide Product Actual Price.' });        
                }               
                product.statusId=1;
                product.modifiedById = user[0].id;
                product.modificationDate = new Date;
                Product.updateProduct(req.body.product_id,product, function(err, data) 
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
            var fn = './public/product/' + req.file.filename;  
            //let newfileName = req.file.filename + ".png"
             jimp.read(fn, function (err, img) {
             if (err) 
                throw err;
                img.resize(250, 250)            // resize
                .quality(100)              // set JPEG quality       
                .write('./public/product/' + fn) // save
                console.log('Resized !!')              
            });  
            var product = new Product(req.body,fn);         

                if(!product.product_name){
                    res.status(400).send({ success:false, message: 'Please Provide Product Name.' });        
                }
                if(!product.product_price){
                    res.status(400).send({ success:false, message: 'Please Provide Product Price.' });        
                }
                if(!product.product_discount){
                    res.status(400).send({ success:false, message: 'Please Provide Product Discount.' });        
                }
                if(!product.product_actualprice){
                    res.status(400).send({ success:false, message: 'Please Provide Product Actual Price.' });        
                }               
                product.statusId=1;
                product.modifiedById = user[0].id;
                product.modificationDate = new Date;
                Product.updateProduct(req.body.product_id,product, function(err, data) 
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

module.exports.updateProductImage = function(req,res)
{
    try
    {    
        if(!req.file)
        {
                res.status(400).send({ success:false, message: 'Please Provide Product Image.' });
        }     
        else
        { 
            var fn = './public/product/' + req.file.filename;  
            //let newfileName = req.file.filename + ".png"
             jimp.read(fn, function (err, img) {
             if (err) 
                throw err;
                img.resize(250, 250)            // resize
                .quality(100)              // set JPEG quality       
                .write('./public/product/' + fn) // save
                console.log('Resized !!')              
            });  
            var product = new Product(req.body,fn);         
            Product.updateProductImage(req.body.product_id,product, function(err, data) 
            {
                if(err){
                        res.send({status:400,success:false,message:"Details not saved."});
                }
                else{
                        res.send({status:200,success:true,message:data.message});
                    }
            });
        }    
        }catch(e){ console.log("catch",e);   }  
}






module.exports.activateDeactivateProduct = function(req,res,next)
{
    passport.authenticate('jwt',function(err,user)
    {
        if (err || !user) 
        {          
            return res.json({ status: 401, success: false, message: "Authentication Fail." });
        }
        else if(user){ 
        //var product = new Product(req.query);
        var statusId = req.query.statusId;           
        Product.deleteProduct(req.query.product_id,statusId,function(err, data) 
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

module.exports.getAllProducts = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Product.getAllProduct(req.query.category_id, req.query.subcategory_id,function(err,data){
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

module.exports.getProducts = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Product.getAllProducts(function(err,data){
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
   //    }
 // })(req,res,next)
}

module.exports.getCountProducts = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Product.getProductsCount(function(err,data){
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


module.exports.getAllProductsCount = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Product.getAllProductCount(req.query.category_id,req.query.subcategory_id,function(err,data){
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

module.exports.getProductPriceLowToHigh = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Product.getProductPriceLowToHigh(function(err,data){
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
   //    }
 // })(req,res,next)
}

module.exports.getProductPriceHighToLow = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Product.getProductPriceHighToLow(function(err,data){
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
     //  }
 // })(req,res,next)
}

module.exports.getProductPriceLowToHighByIds = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Product.getProductPriceLowToHighByIds(req.query.category_id, req.query.subcategory_id,function(err,data){
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
     //  }
  //})(req,res,next)
}


module.exports.getProductPriceHighToLowByIds = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Product.getProductPriceHighToLowByIds(req.query.category_id, req.query.subcategory_id,function(err,data){
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


module.exports.getProductById = function(req,res,next)
{
    // passport.authenticate('jwt',function(err,user)
    // {
    //     if (err || !user) 
    //     {          
    //         return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //     }
    //     else if(user){ 
            Product.getProductById(req.query.product_id,function(err,data){
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


module.exports.searchProduct = function (req, res, next) { 
    // passport.authenticate('jwt', function(err,user)
    // {
    //   if (err || !user) 
    //   {
    //     return res.json({ status: 401, success: false, message: "Authentication Fail." });
    //   }
    //   var page = parseInt(req.query.page);
    //   var size = parseInt(req.query.size);
       var name = req.query.name;    

    //   var query = {}
    //   if(page < 0 || page === 0) {
    //         response = {status:400,success:false, message:"Invalid page number, should start with 1"};
    //         return res.json(response)
    //   }
    //   query.skip = size * (page - 1)
    //   query.limit = size
        var search_query;
    //    if(name)
    //    {
    //     //  search_query = `SELECT count(category.category_name) as CategoryCount,count(subcategory.subcategory_name)
    //     //  as SubcategoryCount, count(product.product_name) as ProductCount
    //     //  from category LEFT JOIN subcategory ON (category.category_id = subcategory.category_id) 
    //     //  LEFT JOIN product ON (category.category_id = product.category_id) 
    //     //  where (category.category_name LIKE '%${name}%' and category.statusId=1) OR (subcategory.subcategory_name 
    //     //  LIKE '%${name}%' and subcategory.statusId=1) OR (product.product_name = '%${name}%' and product.statusId=1)`
         
    //     search_query = `SELECT count(product_name) as Total from product where product_name LIKE '%${name}%'`
    //    }
    //    console.log('Count', search_query);
    //    pool.query(search_query,function(err,totalCount){
    //         if(err) {
    //                response = {status:400,success:false,message:"Error fetching data."};
    //         }
            if(name)
            {

               // search_query = `select product_name from product where product_name LIKE '%${name}%' limit ${query.limit}  offset ${query.skip}`

            //    search_query = `SELECT category.category_name,subcategory.subcategory_name,product.product_name from 
            //                     category  
            //                   LEFT JOIN subcategory ON (category.category_id = subcategory.category_id) 
            //                   LEFT JOIN product ON (category.category_id = product.category_id) 
            //                   where (category.category_name LIKE '%${name}%' and category.statusId=1) OR (subcategory.subcategory_name 
            //                   LIKE '%${name}%' and subcategory.statusId=1) OR (product.product_name = '%${name}%' and product.statusId=1)
            //                   limit ${query.limit}  offset  ${query.skip} `

            // search_query = `SELECT product.*, category.category_name,subcategory.subcategory_name from 
            //     product  
            //     LEFT JOIN category ON (category.category_id = product.category_id) 
            //     LEFT JOIN subcategory ON (subcategory.subcategory_id = product.subcategory_id) 
            //     where product.product_name LIKE '%${name}%' and product.statusId=1
            //     limit ${query.limit}  offset  ${query.skip}`

            search_query = `SELECT product.*, category.category_name,subcategory.subcategory_name from 
            product  
            LEFT JOIN category ON (category.category_id = product.category_id) 
            LEFT JOIN subcategory ON (subcategory.subcategory_id = product.subcategory_id) 
            where product.product_name LIKE '%${name}%' and product.statusId=1
            Order By product.product_name DESC`

            }
            // else
            // {
            //     search_query = `SELECT subcategory_name FROM subcategory WHERE 
            //     WHERE category_name LIKE '%${name}%'  AND StatusId = 1 
            //     limit ${query.limit} offset ${query.skip}`      
            // }
            console.log('Query', search_query);
            pool.query(search_query, function(err,data){
            
            if(err) {
                console.log(err)
                response = {status:400,success:false,message:"Error fetching data"};
            } 
            else if(data.length == 0){
              response = {status: 200, success : false, message : "No Data Found"};
            }
            else {
                //console.log('TC', totalCount);
                //console.log('Size', size);
              //var totalPages = Math.ceil(totalCount[0].Total / size);    

                response = {status: 200, success : true, message : "Data Found", "SearchData": data};
            }
  
            res.json(response);
        });
    //})
   // })(req, res, next);
}


module.exports.getProductsData = function(req,res,next)
{
            Product.getProducts(function(err,data){
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


module.exports.getProductsByCategory = function(req,res,next)
{
            Product.getProductByCategory(req.query.category_id,function(err,data){
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



//To update WareIQ Id.

module.exports.updateProductWareIqId = function(req,res)
{
    try
    {
        var product = {
            "wareiq_id": req.body.wareiq_id,
            "product_id": req.body.product_id
        }        
        Product.updateWareIqId(product, function(err, data) 
        {
            if(err)
            {
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else
            {
                res.send({status:200,success:true,message:data.message});
            }
        });
    }catch(e){ console.log("catch",e);   }  
}