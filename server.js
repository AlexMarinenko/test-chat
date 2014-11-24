var http = require('http');
var EventEmitter = require('events').EventEmitter;
var Router = require('./router');
var AuthRepository = require('./auth');

var host = "127.0.0.1";
var port = 9090;

var accounts = [
    { login: 'login1', password: 'password1' },
    { login: 'login2', password: 'password2' },
    { login: 'login3', password: 'password3' },
    { login: 'login4', password: 'password4' }
];

var emitter = new EventEmitter();

var authRepository = new AuthRepository(emitter, accounts);
var router = new Router(emitter, authRepository);

http.createServer(function (req, res) {
    router.route(req, res);
}).listen(port, host);

console.log('Server running at http://127.0.0.1:9090/');