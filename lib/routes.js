//core node modules
var fs = require('fs');
var exec = require('child_process').exec;
var http = require('http');

//third party application
var request = require('request');

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.status(200).send('default route');
    });

    app.get('/cp', function(req, res) {
        exec('ls', function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            res.status(200).send(stdout);
        });
    });

    app.get('/fsSync', function(req, res) {
        var data = fs.readFileSync('./public/data_dumb');
        console.log('data received' + data);
        res.status(200).send(data.toString());
    });

    app.get('/fsAsync', function(req, res) {
        fs.readFile('./public/data_dumb', {
            "encoding": "utf8"
        }, function(err, data) {
            console.log('data received');
            res.status(200).send(data);
        });
    });

    app.get('/fsStream', function(req, res) {
        var filename = './public/data_dumb';
        var readable = fs.createReadStream(filename, {
            "encoding": "utf8"
        });
        var data;
        readable.on('data', function(chunk) {
            console.log(chunk);
            data = data + chunk;
        });
        readable.on('end', function() {
            console.log('there will be no more data.');
            data
            res.status(200).send(data);
        });
    });

    app.get('/fsPipe', function(req, res) {
        var filename = './public/data_dumb';
        var readable = fs.createReadStream(filename, {
            "encoding": "utf8"
        });
        readable.pipe(res);
    });

    app.get('/httpGet', function(request, response) {
        var options = {
            hostname: 'www.google.com',
            port: 80,
            path: '/',
            method: 'GET'
        };

        var req = http.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            var data = '';
            res.on('data', function(chunk) {
                console.log('BODY: ' + chunk);
                data = data + chunk;
            });
            res.on('end', function() {
                response.status(200).send(data);
            });
        });

        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });

        req.end();
    });

    app.get('/request', function(req, res) {
        request('http://google.com', function(error, response, body) {
            res.status(200).send(body);
        });
    });
};
