//require packages needed
//https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

const express =require('express');
const app=express();
const bodyParser =require('body-parser');
const mysql=require('mysql');
const logger = require('morgan');
const connection=require('./database/connection');
const routes=require('./routes');
const path=require('path');

//configure app to use bodyParser()
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use('/api', routes);

//serve static files
app.use('/rescue/rescue-images',express.static(path.join(__dirname, './entities/rescue/rescue-images')));
app.use('/signup/icons/shelters',express.static(path.join(__dirname, './entities/signup/icons/shelters')));
app.use('/signup/shelter_docs',express.static(path.join(__dirname, './entities/signup/shelter_docs')));
app.use('/signup/icons/users',express.static(path.join(__dirname, './entities/signup/icons/users')));
app.use('/pets/photos',express.static(path.join(__dirname, './entities/pets/photos')));

//https://hackernoon.com/restful-api-design-with-node-js-26ccf66eab09
const port = process.env.PORT || 3000;

//start the server
const server =app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

module.exports=app;