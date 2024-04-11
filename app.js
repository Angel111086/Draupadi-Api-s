const express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var multer = require('multer');
var path = require('path');
const cors = require('cors');
const passport = require('passport');
const app = express();

var https = require('https');
var http = require('http');
var fs = require('fs');
var _ = require('underscore');


app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

/* Accept header wiht request */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization ,Accept');
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Credentials', "true");
  res.header(
      "Access-Control-Allow-Origin",
      "Origin", "x-Requested-With", "Content-Type", "Accept", "Authorization");
  if (req.method === 'OPTIONS') {
      res.header("Access-Control-Allow-Methods", 'PUT,  PATCH, GET, DELETE, POST');
      res.header("HTTP/1.1 200 OK"); 
  }
  next();
})


app.use(passport.initialize());
app.use(passport.session());
require('./authorization/passport')(passport);

console.log('Path',path.join(__dirname))
app.use(express.static(path.join(__dirname, '/public')));

const draupadiapi = require('./router/draupadi.router');
app.use('/draupadi', draupadiapi);


// const httpsServer = https.createServer({
//   key: fs.readFileSync('./pem/key.pem'),
//   cert: fs.readFileSync('./pem/cert.pem'),
// }, app);

const hostname = 'localhost';
const httpPort = 40;
const httpsPort = 4000;

const options = {  
   //key: fs.readFileSync('./pem/newkey.pem'),
   //cert: fs.readFileSync('./pem/newcert.pem'),
  
  //key: fs.readFileSync('/etc/letsencrypt/live/cerbosys.in-0001/privkey.pem'),
  //cert: fs.readFileSync('/etc/letsencrypt/live/cerbosys.in-0001/cert.pem'),

  key: fs.readFileSync('/etc/letsencrypt/live/cerbosys.in/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/cerbosys.in/fullchain.pem'),

  requestCert: false,
  rejectUnauthorized: false
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

app.use((req, res, next) => {
  if(req.protocol === 'http'){
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
})

//var port = 4000;
httpsServer.listen(httpsPort ,function () {
  console.log('Draupadi listening on port 4000!');
});

httpServer.listen(httpPort ,function () {
  console.log('Draupadi listening on port 4000!');
});

// https.createServer(options, function(){
//     console.log('Draupadi listening on port 4000!');
// }).listen(4000);
