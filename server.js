const express =require('express');
const app=express();
const bodyParser =require('body-parser');
const mysql=require('mysql');
const connection=require('./database/connection');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))

//set default route
app.get('/',function(req,res){
    return res.send({error:true,message:'hello'})
});


//https://hackernoon.com/restful-api-design-with-node-js-26ccf66eab09
const port = process.env.PORT || 3000;
const server =app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});


module.exports=app;