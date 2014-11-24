var url = require('url');
var querystring = require('querystring');
var ConnectionManager = require('./connections');


var Router = function(emitter, authRepository){

    var self = this;

    self.authRepository = authRepository;
    self.connectionManager = new ConnectionManager(emitter);

    self.route = function (request, response){

        var urlParams = url.parse(request.url);
        var params = querystring.parse(urlParams.query);
        var sessionId = self.getSessionId(request);

        if (urlParams.pathname == "/auth"){
            emitter.emit('auth', { login: params.login, password: params.password, response: response, sessionId: sessionId ? sessionId : self.generateNewSessionId()});
        }else if (urlParams.pathname == "/message"){
            emitter.emit('message', {message: params.message, response: response, sessionId: sessionId});
        }else if (urlParams.pathname == "/poll"){
            emitter.emit('poll', {response: response, sessionId: sessionId});
        }else{
            emitter.emit('not-found', response);
        }
    };

    self.getSessionId = function (request) {
        var rc = request.headers.cookie;
        var cookies = rc && rc.split(';');
        if (cookies){
            for(i = 0; i < cookies.length; i++){
                var parts = cookies[i].split('=');
                var key = parts.shift().trim();
                if (key == 'session'){
                    var value = parts.shift().trim();
                    return value;
                }
            }
        }
        return false;
    };

    self.generateNewSessionId = function(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +  s4() + '-' + s4() + s4() + s4();
    }

    emitter.on('authorized', function (data){
        data.response.setHeader("Set-Cookie", ["session=" + data.sessionId]);
        data.response.writeHeader(200, {"Content-Type": "text/plain"});
        data.response.end();
    });

    emitter.on('not-authorized', function (response){
        response.writeHeader(401, {"Content-Type": "text/plain"});
        response.end();
    });
    emitter.on('not-found', function (response) {
        response.writeHeader(404, {"Content-Type": "text/plain"});
        response.end();
    });

    emitter.on('ok', function (response) {
        response.writeHeader(200, {"Content-Type": "text/plain"});
        response.end();
    });
};

module.exports = Router;