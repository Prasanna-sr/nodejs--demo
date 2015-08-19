var express = require('express');

var app = express();

var routes = require('./lib/routes');

app.use(express.static(__dirname + '/public'));

routes(app);

app.listen(3000, function() {
	console.log("server running at port 3000");
});
