
var AuthRepository = function (emitter, accounts){

    var self = this;

    emitter.on('auth', function (data){
        if (self.check(data.login, data.password)){
            emitter.emit('authorized', data);
        }else{
            emitter.emit('not-authorized', data.response);
        }
    });

    self.storage = accounts;

    self.check = function (login, password){
        for(i=0; i<self.storage.length; i++){
            if (self.storage[i].login == login && self.storage[i].password == password){
                return true;
            }
        }
        return false;
    };

};

module.exports = AuthRepository;