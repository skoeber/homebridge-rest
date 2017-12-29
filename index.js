var Service, Characteristic;
var request = require('sync-request');

var url 

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-rest-switch", "RestSwitch", RestSwitch);
}


function RestSwitch(log, config) {
    this.log = log;

    // url info
    this.url = config["url"];
    this.http_method = config["http_method"];
    this.sendimmediately = config["sendimmediately"];
    this.default_state_off = config["default_state_off"];
    this.name = config["name"];
}

RestSwitch.prototype = {

    httpRequest: function (url, body, method, username, password, sendimmediately, callback) {
        request({
            url: url,
            body: body,
            method: method,
            rejectUnauthorized: false
        },
        function (error, response, body) {
            callback(error, response, body)
        })
    },

    getPowerState: function (callback) {
        callback(null, !this.default_state_off);
    },

    setPowerState: function(powerOn, callback) {
        var body;

		var res = request(this.http_method, this.url, {});
		if(res.statusCode > 400){
			this.log('REST call failed');
			callback(error);
		}else{
			this.log('REST call succeeded!');
            this.log(res.body);
			callback();
		}

    },

    identify: function (callback) {
        this.log("Identify requested!");
        callback(); // success
    },

    getServices: function () {
        switchService = new Service.Switch(this.name);
        switchService
            .getCharacteristic(Characteristic.On)
            .on('get', this.getPowerState.bind(this))
            .on('set', this.setPowerState.bind(this));

        return [switchService];
    }
};