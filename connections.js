var ConnectionManager = function (emitter){

    var self = this;

    var clients = [];

    var responses = [];

    emitter.on('poll', function (data){
        if (data.sessionId == null || !self.isRegistered(data.sessionId)) {
            emitter.emit('not-authorized', data.response);
        }else{
            self.registerResponse(data.sessionId, data.response);
        }
    });

    emitter.on('message', function (data){
        if (data.sessionId != null && self.isRegistered(data.sessionId)) {
            self.notify(data.sessionId, data.message);
            emitter.emit('ok', data.response);
        }else{
            emitter.emit('not-authorized', data.response);
        }
    });

    emitter.on('authorized', function (data) {
        self.registerClient(data.sessionId, data.login);
    });

    self.registerClient = function (sessionId){
        console.log('Registering client: ' + sessionId);
        clients[sessionId] = 1;
    };

    self.registerResponse = function (sessionId, response){
        responses.push({ id: sessionId, response: response });
    };

    self.isRegistered = function (sessionId){
        return (clients[sessionId] == 1);
    };

    self.notify = function(sessionId, message){
        for(i=0; i<responses.length;i++){
            console.log(sessionId + ' - ' + responses[i].id);
            if (responses[i].id != sessionId)
            {
                responses[i].response.writeHeader(200, {"Content-Type": "application/json"});
                responses[i].response.write(JSON.stringify({from: clients[sessionId], message: message}));
                responses[i].response.end();

            }
        }
        self.unregisterResponses();
    };

    self.unregisterResponses = function (){
        responses = [];
    };

};

module.exports = ConnectionManager;