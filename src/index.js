// Imports
// -------
var $ = require('jquery');
var Tracker = require('./Tracker');
var TrackingSimulation = require('./TrackingSimulation');

// Main code
// ---------

var tracker = new Tracker();
tracker.start();

$('#start').on('click', function() {
    tracker = new Tracker();
    tracker.start()
});

$('#end').on('click', function () {
    tracker.stop();
});

$('#simulate').on('click', function () {
    var simulation = new TrackingSimulation( tracker );
    console.log( simulation );
    simulation.start();
});
