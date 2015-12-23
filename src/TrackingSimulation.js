'use strict';

var moment = require('moment');
var TrackingPointer = require('./TrackingPointer');
var MessageBox = require('./MessageBox');

var inProgress = [];

module.exports = function TrackingSimulation(tracker, options) {

    // Parameter checking
    // ------------------

    if ( tracker.started === false || tracker.ended === false || inProgress.indexOf(tracker) !== -1 )
        return null;

    inProgress.push(tracker);

    // Interface
    // ---------

    var self = {

        // Properties
        tracker: null,
        pointer: null,
        startTime: null,
        pausedTime: 0,
        frame: null,
        firstFrame: tracker.frames[0],
        options: {
            maxDelay: 4 * 1000,
            messageDuration: 2 * 1000,
        },

        // Methods
        start: start,
    };

    var frameReadyEvent = new Event('frameReady');
    var simulationCompleteEvent = new Event('simulationComplete');
    var html = document.querySelector('html');
    var original = {
        height: '',
        width: ''
    };

    // Initialization
    // --------------

    setOptions(options);
    self.tracker = tracker;

    return self;

    // Implementation
    // --------------

    function start() {
        self.pointer = new TrackingPointer();
        self.pointer.toDOM();
        self.startTime = moment();
        document.addEventListener('frameReady', simulateCurrentFrame);
        document.addEventListener('simulationComplete', cleanUp);
        original.width = html.style.width;
        original.heigth = html.style.height;
        self.frame = self.firstFrame;

        document.dispatchEvent(frameReadyEvent);
    }

    function cleanUp() {
        self.pointer.fromDOM();
        self.frame = null;
        document.removeEventListener('frameReady', simulateCurrentFrame, false);
        document.removeEventListener('simulationComplete', cleanUp, false);
        inProgress.splice(inProgress.indexOf(tracker));
        html.style.width = original.width;
        html.style.height = original.height;
    }

    function setOptions(options) {
        if (! options)
            return;
        for (var prop in options) {
            if (self.options.hasOwnProperty(prop))
                self.options[prop] = options[prop];
        }
    }

    function simulateCurrentFrame() {

        self.pointer.moveTo(self.frame.x, self.frame.y);
        window.scrollTo(self.frame.pageXOffset, self.frame.pageYOffset);

        html.style.width = self.frame.clientWidth + 'px';
        html.style.height = self.frame.clientHeight + 'px';

        if (self.frame.event.type === 'click') {
            self.pointer.performClick();
        }

        callNextSimulation();
    }

    function callNextSimulation() {
        if ( ! self.frame.next ) {
            return document.dispatchEvent(simulationCompleteEvent);
        }

        var timeout = self.frame.next.time - timePassed();

        if (timeout > self.options.maxDelay) {
            self.pausedTime += timeout - self.options.messageDuration;
            timeout = self.options.messageDuration;
            new MessageBox('User waiting. Fast forwardig.', timeout);
        }

        if (timeout < 0)
            timeout = 0;

        self.frame = self.frame.next;

        return setTimeout(function () {
            document.dispatchEvent(frameReadyEvent);
        }, timeout);
    }

    function timePassed() {
        return moment().diff(self.startTime) + self.pausedTime;
    }
}
