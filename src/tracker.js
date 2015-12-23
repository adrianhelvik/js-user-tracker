var _ = require('lodash');
var moment = require('moment');

module.exports = function Tracker() {

    // Interface
    // ---------

    var self = {
        started: false,
        stopped: false,
        frames: [],
        start: start,
        stop: stop,
        duration: duration
    };

    // Initialization
    // --------------

    clearLocalStorage();

    return self;

    // Implementation
    // --------------

    function Frame(event) {
        var frame = {
            time: moment().diff(self.started),
            x: event.clientX + window.pageXOffset,
            y: event.clientY + window.pageYOffset,
            pageXOffset: window.pageXOffset,
            pageYOffset: window.pageYOffset,
            clientWidth: document.querySelector('html').clientWidth,
            clientHeight: document.querySelector('html').clientHeight,
            next: null,
            event: {
                type: event.type
            }
        }

        // If not first frame, add this as next to previous
        if (self.frames.length) {
            self.frames[self.frames.length-1].next = frame;
            window.localStorage.setItem('tracker.frame[' + (self.frames.length-1) + ']', JSON.stringify(self.frames[self.frames.length-1]));
        }

        // Store frame
        self.frames.push(frame);
        window.localStorage.setItem('tracker.frame.index', self.frames.length - 1);
        window.localStorage.setItem('tracker.frame[' + self.frames.length - 1 + ']', JSON.stringify(frame));

        return frame;
    }

    function start() {
        self.started = moment();
        listen();
    }

    function listen() {
        window.addEventListener('scroll', Frame);
        window.addEventListener('mousemove', Frame);
        window.addEventListener('click', Frame);
        window.addEventListener('mouseup', Frame);
        window.addEventListener('resize', Frame);
    }

    function stop() {
        window.removeEventListener('scroll', Frame);
        window.removeEventListener('mousemove', Frame);
        window.removeEventListener('click', Frame);
        window.removeEventListener('mouseup', Frame);
        window.removeEventListener('resize', Frame);
        self.stopped = moment();
    }

    function duration() {
        if ( ! self.started )
            return 0;
        if ( ! self.stopped )
            return moment().diff(self.started);
        return self.stopped.diff(self.started);
    }

    function clearLocalStorage() {
        for (var prop in window.localStorage) {
            if (prop.trim().indexOf('tracker') === 0) {
                console.log(prop);
                window.localStorage.removeItem(prop);
            }
        }
    }
}
