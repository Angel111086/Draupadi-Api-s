var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Product = function(product, file) {   
  this.category_id = product.category_id;
  this.subcategory_id = product.subcategory_id;    
  this.product_name = product.product_name;
  this.product_description = product.product_description;   
  this.product_price = product.product_price;   
  this.product_discount = product.product_discount;   
  this.product_actualprice = product.product_actualprice;   
  //this.product_quantity = product.product_quantity;   
  this.product_image = file;   
  this.length = product.length;   
  this.breadth = product.breadth;   
  this.height = product.height;   
  this.weight = product.weight;   
  this.statusId = product.statusId;
  this.createdById = product.createdById;  
  this.creationDate = product.creationDate;
  this.modifiedById = product.modifiedById;
  this.modificationDate = product.modificationDate;
};

Product.createProduct = function (product, result) {       
    pool.query("INSERT INTO product SET ?", product, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);         
                result(null, {status:200,success:true,message:"Details Saved Successfully.", id: res.insertId});

            }
        });           
};

Product.updateProduct = function(id,product,result) {
    var update_query, value;
    pool.query(`select * from product where product_id=${id}`,function(err, data){
        if(err){
            console.log(err);
            result(err, null);
        }
        else{
            console.log(data.length);
            if(data.length>0)
            {
                if(product.product_image !== undefined){
                    update_query = `update product SET product_name=?, product_description=?, product_price=?,
                    product_discount=?, product_actualprice=?, product_image=?,length=?, breadth=?, height=?,
                    weight=?, modifiedById=?, 
                    modificationDate=? where product_id=?`;

                    value = [product.product_name, product.product_description, product.product_price, 
                    product.product_discount, product.product_actualprice, product.product_image,
                    product.length, product.breadth, product.height, product.weight, product.modifiedById,
                    product.modificationDate, id];
                }
                else{
                    update_query = `update product SET product_name=?, product_description=?, product_price=?,
                    product_discount=?, product_actualprice=?,length=?, breadth=?, height=?,
                    weight=?, modifiedById=?, modificationDate=? where product_id=?`;

                    value = [product.product_name, product.product_description, product.product_price, product.product_discount,
                    product.product_actualprice, product.length, product.breadth, product.height, product.weight, product.modifiedById,
                    product.modificationDate, id];
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

Product.updateProductImage = function(id,product,result) {
    var update_query, value;

    update_query = `update product SET product_image=?  where product_id=?`;

    value = [product.product_image,id];

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



Product.deleteProduct = function (id,statusId,result) {       
    pool.query("update product SET statusId=? where product_id=?", 
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

Product.getAllProduct = function (category_id, subcategory_id ,result) {       
    pool.query(`select * from product Where category_id=${category_id} and subcategory_id=${subcategory_id}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Product.getAllProducts = function (result) {       
    pool.query(`select * from product order by product_id DESC`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Product.getProductsCount = function (result) {       
    pool.query(`select count(*) as Total from product Where statusId=1`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Product.getAllProductCount = function (category_id, subcategory_id ,result) {       
    pool.query(`select count(*) as Total from product Where statusId=1 and category_id=${category_id} and subcategory_id=${subcategory_id}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Product.getProductPriceLowToHigh = function (result) {       
    pool.query(`SELECT * FROM product where statusId=1 ORDER BY product_price ASC`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Product.getProductPriceHighToLow = function (result) {       
    pool.query(`SELECT * FROM product where statusId=1 ORDER BY product_price DESC`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


Product.getProductPriceLowToHighByIds = function (category_id, subcategory_id,result) {       
    pool.query(`SELECT * FROM product where category_id = ${category_id}
                and ${subcategory_id} and statusId=1 ORDER BY product_price ASC`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Product.getProductPriceHighToLowByIds = function (category_id, subcategory_id,result) {       
    pool.query(`SELECT * FROM product where category_id = ${category_id}
                and ${subcategory_id} and statusId=1 ORDER BY product_price DESC`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


Product.getProductById = function (product_id,result) {    
    var query = `select pro.*, cat.category_name, sub.subcategory_name
    from product pro LEFT JOIN category as cat 
    ON(pro.category_id = cat.category_id) 
    LEFT JOIN subcategory as sub ON(pro.subcategory_id = sub.subcategory_id)
    Where pro.statusId=1 and pro.product_id = ${product_id}`;  
    
    pool.query(query, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


Product.getProducts = function (result) {       
    pool.query(`SELECT product.*, category.category_name,subcategory.subcategory_name from 
    product  
    LEFT JOIN category ON (category.category_id = product.category_id) 
    LEFT JOIN subcategory ON (subcategory.subcategory_id = product.subcategory_id) 
    where product.statusId=1`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};


Product.getProductByCategory = function (category_id,result) {       
    pool.query(`SELECT product.*, category.category_name,subcategory.subcategory_name from 
    product  
    LEFT JOIN category ON (category.category_id = product.category_id) 
    LEFT JOIN subcategory ON (subcategory.subcategory_id = product.subcategory_id) 
    where product.statusId=1 and product.category_id=?`, [category_id],function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Product.updateWareIqId = function (product,result) { 
    console.log('Update Data', product);     
    pool.query(`update product set WareIQ_ID=${product.wareiq_id} where product_id=${product.product_id}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, {status:200,success:true,message:"Details Updated Successfully."});

            }
        });           
};




module.exports = Product;