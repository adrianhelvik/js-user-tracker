module.exports = ClickTracker;

console.log( 'hello there' );

function ClickTracker(interval) {

    interval = interval && interval > 0 || 100;

    var self = {
        tracker: {},
        start: start,
        store: store,
        restart: restart
    };

    function start() {
        console.log( 'Starting tracker...' );
        self.tracker = trackMovement(interval);
        return self;
    }

    function store() {}

    function trackMovement(interval) {

        var x, y;
        var time = 0;

        var tracker = {
            interval: interval,
            sequence: []
        };

        document.addEventListener( 'mousemove', trackPosition );
        document.addEventListener( 'click', trackClicks );
        console.log( 'interval:', setInterval( storePosition, interval ) );

        function trackPosition( event ) {
            x = event.clientX;
            y = event.clientY;
        }

        function storePosition() {
            tracker.sequence.push({
                time: time,
                x: x,
                y: y
            });
            time += interval;
        }

        function trackClicks( event ) {
            event.preventDefault();
            var elementMouseIsOver = document.elementFromPoint(x, y);

            var clickEvent = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": false
            });

            tracker.sequence[tracker.sequence.length-1]
            .click = elementMouseIsOver;

            elementMouseIsOver.dispatchEvent( clickEvent );
        }

        return tracker;
    }
}
