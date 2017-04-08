const express = require('express');  
const PORT = process.env.PORT || 3000;
const app = express();

// Routes files
var routes = require('./routes/github');

app.use('*',function(req,res,next){
	console.log(req.method,req.url)
	next()
});

// Routes Middleware
app.use('/', routes);

app.listen(PORT, function () {  
    console.log('app listening on port', PORT);
});