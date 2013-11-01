/**
 * Sample script to blink LED 13
 */


console.log('blink start ...');

var ledPin = 13;
var lastFeed = 0;
var linesBetweenFeed = 10;

var https = require('https');

var url = 'https://api.github.com/repos/grantgibson/ir-switch/stats/code_frequency';

https.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
        body += chunk;
    });

    res.on('end', function() {
        var ghResponse = JSON.parse(body);
        var linesThisWeek = ghResponse[ghResponse.length-1][1];
        console.log("Got response: ", linesThisWeek);
        
        if(linesThisWeek < lastFeed) {
        	// Lines added are less than the last time we checked - new week?  If so, reset counter.
        	lastFeed = linesThisWeek;
        }
        
        if(lastFeed+linesBetweenFeed <= linesThisWeek) {
        	console.log("Enough new lines for a feed...");
        	// TODO: pull the pin low to dispense
        	
        	// Update the lastFeed data
        	lastFeed = linesThisWeek;
        } else {
        	console.log("Monkey write more code...");
        }
    });
}).on('error', function(e) {
      console.log("Got error: ", e);
});






var firmata = require('../lib/firmata');
var board = new firmata.Board('/dev/tty.usbmodemfd121', function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('connected');

    console.log('Firmware: ' + board.firmware.name + '-' + board.firmware.version.major + '.' + board.firmware.version.minor);

    var ledOn = true;
    board.pinMode(ledPin, board.MODES.OUTPUT);





    setInterval(function(){

	if (ledOn) {
        console.log('+');
        board.digitalWrite(ledPin, board.HIGH);
	}
	else {
        console.log('-');
        board.digitalWrite(ledPin, board.LOW);
	}

	ledOn = !ledOn;

    },500);

});
