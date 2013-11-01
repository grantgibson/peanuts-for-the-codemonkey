/**
 * Peanuts for the code monkey
 * by Grant Gibson 
 * (standing on the shoulder of giants - jgautier / firmata)
 * Dispenses peanuts - or the snack of your choice - in exchange for X lines of code added to a GitHub repo
 */


console.log('Peanuts for the codemonkey starting...');

var ledPin = 13;
var buttonPin = 12;
var lastFeed = 0;
var linesBetweenFeed = 10;
var checkFrequency = 30; // secs

var ghUser = "grantgibson";
var ghRepo = "peanuts-for-the-codemonkey";

var https = require('https');
var firmata = require('../lib/firmata');

var board = new firmata.Board('/dev/tty.usbserial-AD01Z6TO', function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('connected');

    console.log('Firmware: ' + board.firmware.name + '-' + board.firmware.version.major + '.' + board.firmware.version.minor);

    var ledOn = true;
    board.pinMode(ledPin, board.MODES.OUTPUT);
    board.pinMode(buttonPin, board.MODES.INPUT);

	checkRepo();
    setInterval(checkRepo,checkFrequency*1000);

});

function checkRepo(){
	
	var url = 'https://api.github.com/repos/' + ghUser + '/' + ghRepo + '/stats/code_frequency';
	
	https.get(url, function(res) {
	    var body = '';
	
	    res.on('data', function(chunk) {
	        body += chunk;
	    });
	
	    res.on('end', function() {
	        var ghResponse = JSON.parse(body);
	        var linesThisWeek = 0;
	        
	        if(ghResponse && ghResponse.length && ghResponse[ghResponse.length-1].length) {
		        linesThisWeek = ghResponse[ghResponse.length-1][1];
		        console.log("GitHub says... " + linesThisWeek + " lines added this week.");
		    } else {
		    	// GitHub typically returns an empty response for the first request if it isn't cached
		    	console.log("No response this time, trying again.");
		    	setTimeout(checkRepo, 2000);
		    	return false;
		    }
	        
	        if(linesThisWeek < lastFeed) {
	        	// Lines added are less than the last time we checked - new week?  If so, reset counter.
	        	lastFeed = linesThisWeek;
	        }
	        
	        if(lastFeed == 0) {
	        	console.log("Free start up bonus:");
	        }
	        
	        if(linesThisWeek >= lastFeed+linesBetweenFeed) {
	        	console.log("Feed the monkey...");
	        	// Light the LED
	        	board.digitalWrite(ledPin, board.HIGH);
	        	// Pull the trigger pin high (or low?)
	        	board.digitalWrite(buttonPin, board.HIGH);
	        	
	        	// Set pins off again
	        	setTimeout(function(){
	        		console.log("Off again");
	        		board.digitalWrite(ledPin, board.LOW);
	        		board.digitalWrite(buttonPin, board.LOW);
	        	}, 1000);
	        	
	        	// Update the lastFeed data
	        	lastFeed = linesThisWeek;
	        } else {
	        	console.log("Monkey write more code!");
	        }
	    });
	}).on('error', function(e) {
	      console.log("Got error: ", e);
	});

}
