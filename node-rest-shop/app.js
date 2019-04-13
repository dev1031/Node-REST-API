const express = require("express");
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true)// this is also for the deprication err/warning otherwise you can ignore for now
//just read the stack oveflow or something else

//morgan is used for the logs related to the server like: timeout, request , paths, routes, paths, url
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
mongoose.connect("mongodb+srv://node-shop:"
 +process.env.MONGO_ATLAS_PW 
 +"@node-rest-shop-r8doy.mongodb.net/test?retryWrites=true",
 { useNewUrlParser: true }
)

mongoose.Promise =global.Promise;//this will resolve the Deprecation Problem in server that's
//why we are using it otherwise we can ignore it.

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Header",
        "Origin", "X-REquested-With, Content-Type,Accept,Authorization"
        );
        if(req.method ==='OPTION'){
            res.header('Access-Controll-Allow-Methods','PUT, POST, GET,DELETE, PATCH');
            return res.status(200).json({});
        }
        next()
});

//routes which will handle the routes 
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes)

app.use((req, res, next)=>{
    var error = new Error('Not Found');
    error.status= 404;
    next(error);
});

app.use((error, req, res, next)=>{
    //
    res.json({
        error: error.message
    });
    res.status(error.status|| 500);
});

module.exports = app;