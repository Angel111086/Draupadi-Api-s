const express = require('express');
const router = express.Router();
var multer = require('multer');
var http = require('http');
var path = require('path');

//controllers listing
const greetcontroller = require('../controllers/greeting.controller');
const admincontroller = require('../controllers/admin.controller');
const categorycontroller = require('../controllers/category.controller');
const subcategorycontroller = require('../controllers/subcategory.controller');
const productcontroller = require('../controllers/product.controller')
const usercontroller = require('../controllers/user.controller');
const ordercontroller = require('../controllers/order.controller')
const orderdetailcontroller = require('../controllers/orderdetail.controller')
const offercontroller = require('../controllers/offer.controller');
const shippingcontroller = require('../controllers/shipping.controller')
const invoicecontroller = require('../controllers/invoice.controller')
const wishlistcontroller = require('../controllers/wishlist.controller')
const subscriptioncontroller = require('../controllers/subscription.controller')
const customiseddesigncontroller = require('../controllers/customiseddesign.controller')
const salecontroller = require('../controllers/sale.controller');
const revenuecontroller = require('../controllers/revenue.controller');
const cardcontroller = require('../controllers/card.controller');
const shoppingcartcontroller = require('../controllers/shoppingcart.controller');
const notokencontroller = require('../controllers/notoken.controller');

const DIR = './public/product';
let storage = multer.diskStorage({	
    destination: function (req, file, callback) {
      callback(null, DIR);        
    },
    filename: function (req, file, cb) 
    {      
      cb(null, file.originalname);      
 	}
});
let upload = multer({storage: storage});

//-----------------------------------------------------------

const USERDIR = './public/user';
let storageUser = multer.diskStorage({	
    destination: function (req, file, callback) {
      callback(null, USERDIR);        
    },
    filename: function (req, file, cb) 
    {      
      cb(null, file.originalname);      
 	}
});
let uploadUser = multer({storage: storageUser}); 

//-------------------------------------------------------------------


const DESIGNDIR = './public/designs';
let storageDesign = multer.diskStorage({	
    destination: function (req, file, callback) {
      callback(null, DESIGNDIR);        
    },
    filename: function (req, file, cb) 
    {      
      cb(null, file.originalname);      
 	}
});
let uploadDesign = multer({storage: storageDesign}); 
//-----------------------------------------------------------------------

const CARTDIR = './public/cart';
let storageCart = multer.diskStorage({	
    destination: function (req, file, callback) {
      if(file.fieldname === "product_image"){
        callback(null, CARTDIR);        
      }
      else if(file.fieldname === "design_image"){
        callback(null, CARTDIR);
      }
    },
    filename: function (req, file, cb) 
    {      
      cb(null, file.originalname);      
 	}
});
let uploadCart = multer({storage: storageCart}); 



//---------------------------------------------------------------------
router.get("/greetings", greetcontroller.greetings);

//--------------------------------------------------------------------------

//------------------Admin Login---------------------------------------------
router.post("/adminLogin", admincontroller.adminLogin);
router.post('/forgotPassword', admincontroller.forgotPassword);
router.post('/resetPassword', admincontroller.resetPassword);
router.post('/changePassword', admincontroller.changePassword);
//--------------------------------------------------------------------------

//-------------------Category Api-------------------------------
router.post("/insertCategory", categorycontroller.insertCategory);
router.post("/updateCategory", categorycontroller.updateCategory);
router.get("/activateDeactivateCategory", categorycontroller.activateDeactivateCategory);
router.get("/getAllCategories", categorycontroller.getAllCategories);
//-----------------------------------------------------------------------

//-----------------------Subcategory Api---------------------------

router.post("/insertSubcategory", subcategorycontroller.insertSubcategory);
router.post("/updateSubcategory", subcategorycontroller.updateSubcategory);
router.get("/activateDeactivateSubcategory", subcategorycontroller.activateDeactivateSubcategory);
router.get("/getAllSubcategoriesByCategory", subcategorycontroller.getAllSubcategoriesByCategory)
//-----------------------------------------------------------------

//-----------------------Product Api---------------------------

router.post("/insertProduct", upload.single('product_image'),productcontroller.insertProduct);
router.post("/updateProduct", upload.single('product_image'),productcontroller.updateProduct);
router.post("/updateProductImage", upload.single('product_image'),productcontroller.updateProductImage);
router.get("/activateDeactivateProduct", productcontroller.activateDeactivateProduct);
router.get("/getAllProducts", productcontroller.getAllProducts);
router.get('/getProducts',productcontroller.getProducts);
router.get('/getCountProducts', productcontroller.getCountProducts);
router.get('/getAllProductsCount', productcontroller.getAllProductsCount);
router.get('/getProductPriceLowToHigh', productcontroller.getProductPriceLowToHigh);
router.get('/getProductPriceHighToLow', productcontroller.getProductPriceHighToLow);
router.get('/getProductPriceLowToHighByIds', productcontroller.getProductPriceLowToHighByIds);
router.get('/getProductPriceHighToLowByIds', productcontroller.getProductPriceHighToLowByIds);
router.get('/searchProduct', productcontroller.searchProduct);
router.get('/getProductById', productcontroller.getProductById);
router.get('/getProductsData', productcontroller.getProductsData);
router.get('/getProductsByCategory', productcontroller.getProductsByCategory);
router.post('/updateProductWareIqId', productcontroller.updateProductWareIqId);

//-----------------------------------------------------------------

//-----------------------User Api---------------------------

router.post("/registerUser", usercontroller.registerUser);
router.post("/userLogin",usercontroller.userLogin);
router.post("/updateUser", uploadUser.single('user_image'),usercontroller.updateUser);
router.get("/getAllUsers", usercontroller.getAllUsers);
router.get("/getUserById", usercontroller.getUserById);
router.get("/getUserForUpdate", usercontroller.getUserForUpdate);

//-----------------------------------------------------------------

//-----------------------Orders Api---------------------------

router.post("/insertOrder", ordercontroller.insertOrder);
router.post("/updateOrder", ordercontroller.updateOrder);
router.get("/deleteOrder", ordercontroller.deleteOrder);
router.get("/getAllOrders", ordercontroller.getAllOrders);
router.get("/getAllOrdersByUserId", ordercontroller.getAllOrdersByUserId);
router.get("/getAllOrdersByDate",ordercontroller.getAllOrdersByDate);
router.get('/incomingOrder', ordercontroller.incomingOrder);
router.get('/todayOrder', ordercontroller.todayOrder);
router.get('/getOrdersByUserId', ordercontroller.getOrdersByUserId);
router.post('/proceedToCheckout', ordercontroller.proceedToCheckout);
router.post('/updateShipRocketDetails', ordercontroller.updateShipRocketDetails);
//-----------------------------------------------------------------

//--------------------------OrderDetail Api-------------------------
router.post("/insertOrderDetail", orderdetailcontroller.insertOrderDetail);
router.post("/updateOrderDetail", orderdetailcontroller.updateOrderDetail);
router.get("/deleteOrderDetail", orderdetailcontroller.deleteOrderDetail);
router.get("/getAllOrderDetail", orderdetailcontroller.getAllOrderDetail);
//-----------------------------------------------------------------

//--------------------------Offer Api-------------------------
router.post("/insertOffer", offercontroller.insertOffer);
router.post("/updateOffer", offercontroller.updateOffer);
router.get("/deleteOffer", offercontroller.deleteOffer);
router.get("/getAllOffers", offercontroller.getAllOffers);
router.get('/activateDeactivateOffer', offercontroller.activateDeactivateOffer);
router.get('/getTotalOffers', offercontroller.getTotalOffers);
router.get('/getActiveOffers', offercontroller.getActiveOffers);
router.get('/getOfferByCode', offercontroller.getOfferByCode);
//-----------------------------------------------------------------

//--------------------------Shipping Api-------------------------
router.post("/insertShippingAddress", shippingcontroller.insertShippingAddress);
router.post("/updateShippingAddress", shippingcontroller.updateShippingAddress);
router.get("/deleteShippingAddress", shippingcontroller.deleteShippingAddress);
router.get("/getAllAddress", shippingcontroller.getAllAddress);
router.get("/getAddressByShippingId", shippingcontroller.getAddressByShippingId);
//-----------------------------------------------------------------


//---------------------------Invoice Api's---------------------------
router.post('/generateInvoice',invoicecontroller.generateInvoice);
router.get('/printInvoice', invoicecontroller.printInvoice);
//-------------------------------------------------------------------


//--------------------------Wishlist Api-------------------------
router.post("/insertWishlist", wishlistcontroller.insertWishlist);
router.post("/updateWishlist", wishlistcontroller.updateWishlist);
router.get("/deleteWishlist", wishlistcontroller.deleteWishlist);
router.get("/getAllWishlist", wishlistcontroller.getAllWishlist);
//-----------------------------------------------------------------


//--------------------Subscription Api-----------------------------

router.post('/insertSubscription', subscriptioncontroller.insertSubscription);
router.get('/getAllSubscription', subscriptioncontroller.getAllSubscription);

//-------------------------------------------------------------------

//-----------------------Custom Design Api---------------------------

router.post("/insertCustomisedDesign", uploadDesign.single('designimage'),customiseddesigncontroller.insertCustomisedDesign);
router.post("/updateCustomisedDesign", uploadDesign.single('designimage'),customiseddesigncontroller.updateCustomisedDesign);
router.get("/enableDisableDesign", customiseddesigncontroller.enableDisableDesign);
router.get("/deleteCustomisedDesign", customiseddesigncontroller.deleteCustomisedDesign);
router.get('/getAllCustomisedDesigns', customiseddesigncontroller.getAllCustomisedDesigns);
router.get('/getAllCustomisedDesignsById', customiseddesigncontroller.getAllCustomisedDesignsById);
router.get('/getAllCustomisedDesignsCount', customiseddesigncontroller.getAllCustomisedDesignsCount);
router.get('/getCustomisedDesignPriceLowToHigh', customiseddesigncontroller.getCustomisedDesignPriceLowToHigh);
router.get('/getCustomisedDesignPriceHighToLow', customiseddesigncontroller.getCustomisedDesignPriceHighToLow);
router.get('/getRecentlyAddedCustomisedDesigns', customiseddesigncontroller.getRecentlyAddedCustomisedDesigns);


//-----------------------------------------------------------------

//----------------------------Analytics Api----------------------------
router.get('/getAllYearSale', salecontroller.getAllYearSale);
//router.get('/getYearlySale', salecontroller.getYearlySale);
router.get('/getMonthlySale', salecontroller.getMonthlySale);
router.get('/getWeeklySale', salecontroller.getWeeklySale);
router.get('/getTotalYearSales', salecontroller.getTotalYearSales);
router.get('/getYearMonthSales', salecontroller.getYearMonthSales);
router.get('/getYearMonthWeekSales', salecontroller.getYearMonthWeekSales);
router.get('/getTopFourProduct', salecontroller.getTopFourProduct);

//----------------------------------------------------------------------


//----------------------------Revenue Api----------------------------
router.get('/getAllYearRevenue', revenuecontroller.getAllYearRevenue);
router.get('/getMonthlyRevenue', revenuecontroller.getMonthlyRevenue);
router.get('/getWeeklyRevenue', revenuecontroller.getWeeklyRevenue);
router.get('/getTotalYearRevenue', revenuecontroller.getTotalYearRevenue);
router.get('/getYearMonthRevenue', revenuecontroller.getYearMonthRevenue);
router.get('/getYearMonthWeekRevenue', revenuecontroller.getYearMonthWeekRevenue);

//----------------------------------------------------------------------

//----------------------------Revenue Api----------------------------
router.get('/getTotalOrders', cardcontroller.getTotalOrders);
router.get('/getTotalRevenueByMonth', cardcontroller.getTotalRevenueByMonth);
router.get('/getTotalUsers', cardcontroller.getTotalUsers);

//----------------------------------------------------------------------

//------------------------Checkout-------------------------------------
router.post('/proceedToCheckout', ordercontroller.proceedToCheckout);
router.post('/updatePaymentStatus', ordercontroller.updatePaymentStatus);
//-----------------------------------------------------------------



//-----------------------ShoppingCart Api's------------------------

router.post('/addToCart', uploadCart.fields([
  {name: 'product_image', maxCount: 1},
  {name: 'design_image', maxCount: 1}]),shoppingcartcontroller.addToCart);

//router.post('/updateCart', shoppingcartcontroller.updateCart);
router.get('/deleteCart', shoppingcartcontroller.deleteCart);
router.get('/getUserCartItems',shoppingcartcontroller.getUserCartItems);
router.get('/getTotalCartProduct', shoppingcartcontroller.getTotalCartProduct);
router.get('/getTotalCartItems', shoppingcartcontroller.getTotalCartItems);
router.get('/clearCart', shoppingcartcontroller.clearCart);
//-----------------------------------------------------------------------------------

//---------------------No Token----------------------------------------------

router.post('/addToCartWT', notokencontroller.addToCartWT);
router.post('/userLoginWT', notokencontroller.userLoginWT)
//--------------------------------------------------------------------------


module.exports = router;