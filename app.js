const express = require('express');  
const PORT = process.env.PORT || 3000;
const app = express();

// Routes files
var routes = require('./routes/github');

app.use('*',function(req,res,next){
	console.log(req.method,req.url);
	next()
});

app.use('/public',  express.static(__dirname + '/public'));
console.log(__dirname);
// Routes Middleware
app.use('/', routes);

/*app.get('/video',function(req,res){
  res.sendFile('E:/redisNode/index.html');
  //It will find and locate index.html from View or Scripts

});*/

app.listen(PORT, function () {  
    console.log('app listening on port', PORT);
});