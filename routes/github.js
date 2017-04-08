var express       = require('express');
var router        = express.Router();
const redis = require('redis');  
const request = require('request');  

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);

function respond(org, numberOfRepos) {  
    return `${org} has ${numberOfRepos} public repositories.`;
}

function getNumberOfRepos(req, res, next) {  
	console.log(req.method,req.url)

    const org = req.query.org;
   request.get(`https://api.github.com/orgs/${org}/repos`, function (err, response) {
        if (err) throw err;

        // response.body contains an array of public repositories
        var repoNumber = response.body.length;
        client.setex(org, 50, repoNumber); 
        res.send(respond(org, repoNumber));
    });
};

function cacheOrg(req, res, next) {  
    const org = req.query.org;
    client.get(org, function (err, data) {
        if (err) throw err;

        if (data != null) {
        	console.log("from cache");
            res.send(respond(org, data));
        } else {
        	console.log("not from cache");
            next();
        }
    });
};

function getUsers(req, res, next) {  
	// console.log(req.method,req.url)

    const userName = req.query.username;
   request({
    headers: {
      'user-agent': 'node.js'
    },
    url: `https://api.github.com/search/users?q=${userName}`,
    method: 'GET'
  }, function (err, response, body) {
    var x = JSON.parse(body);
    var y = JSON.stringify(body);
    client.setex(userName, 50, y);
        res.json(x);

  });
};

function cacheUser(req, res, next) {  
    const username = req.query.username;
    client.get(username, function (err, data) {
        if (err) throw err;

        if (data != null) {
        	console.log("from cache");
        	var cacheData = JSON.parse(data);
            res.send(cacheData);
        } else {
        	console.log("not from cache");
            next();
        }
    });
};

router.get('/', function(req,res){
	// console.log()
	console.log(req.method,req.url)
	res.json({"requested url" : req.url, "req Method" : req.method })
});

router.get('/repos',cacheOrg, getNumberOfRepos);
router.get('/user',cacheUser, getUsers);

module.exports = router;