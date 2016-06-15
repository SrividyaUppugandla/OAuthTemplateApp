// dependencies
var fs = require('fs');
var express = require('express');
var path = require('path');
var config = require('./config.json');
var app = express();

// configure Express
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

});

// routes
app.get('/', function(req, res){
    res.redirect('/login');
});

//Login page to show the provider options to login
app.get('/login', function(req, res){
    res.render('index', { title: "OAuth Authentication", config: config});
});

app.get('/OAuth', function(req, res){
    var serviceUrl=config.serviceUrl+"/";
    var callbackUrl=config.callbackUrl;
    var provider = req.query.provider;
    if(provider == "twitter"){
        serviceUrl = "http://127.0.0.1:3000/";
    }
    var baseUrl = serviceUrl+provider+"?callbackUrl="+callbackUrl;
    res.redirect(baseUrl);
});

app.get('/callback', function(req, res){
    if(req.query.accessToken){
        console.log("accesstoken : "+ req.query.accessToken);
        console.log("id : "+ req.query.id);
        console.log("displayName : "+ req.query.displayName);
        console.log("provider : "+ req.query.provider);

        if(req.query.refreshToken) {
            console.log("refreshToken : "+ req.query.refreshToken);
        }

        var profile = {
            id : req.query.id,
            displayName : req.query.displayName
        }

        res.render('account', { user: profile });
    }
    else {
        res.render('index', { title: "OAuth Authentication", config: config});
    }

});

app.get('/logout', function(req, res){
    var serviceUrl=config.serviceUrl;
    var callbackUrl=config.callbackUrl;
    res.redirect(serviceUrl+"/logout?callbackUrl="+callbackUrl);
});


// port
var port = process.env.VCAP_APP_PORT || 3001;
app.listen(port);

module.exports = app;

