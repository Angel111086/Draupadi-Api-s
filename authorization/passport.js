const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const pool = require('../authorization/pool');

module.exports = function (passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); 
    opts.secretOrKey = "draupadibags";
    passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{         
        console.log('Type=>', jwt_payload.type);
        console.log("JWT ID=>", jwt_payload._id);
        console.log("JWT Password=>", jwt_payload.password);
        if(jwt_payload.type == 'admin')
        {
            pool.query('SELECT * FROM adminlogin WHERE id = ' 
            +jwt_payload._id+ ' AND adminpassword = "' + jwt_payload.password +'"', function(err,result)
            {
                if(err){
                    console.log("PassportTest1");
                    return done(err,false,{ message: 'Invalid token.' });                
                }
                else if(result){
                    console.log("PassportTest2");
                    return done(null,result);
                }
                else{
                    console.log("PassportTest3");
                    return done(null,false, { message: 'Invalid request.' });
                }
            });
        }
        else if(jwt_payload.type == 'user'){
            pool.query('SELECT * FROM user WHERE user_id = ' 
            +jwt_payload._id, function(err,result)
            {
                if(err){
                    console.log("PassportUser1");
                    return done(err,false,{ message: 'Invalid token.' });                
                }
                else if(result){
                    console.log("PassportUser2", result);
                    return done(null,result);
                }
                else{
                    console.log("PassportUser3");
                    return done(null,false, { message: 'Invalid request.' });
                }
            }); 
        }
    }))
}