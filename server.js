//require packages needed
//https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

const express =require('express');
const app=express();
const bodyParser =require('body-parser');
const mysql=require('mysql');
const logger = require('morgan');
const connection=require('./database/connection');
const routes=require('./routes');
//configure app to use bodyParser()
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use('/api', routes);


//https://hackernoon.com/restful-api-design-with-node-js-26ccf66eab09
const port = process.env.PORT || 3000;

//start the server
const server =app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

module.exports=server;