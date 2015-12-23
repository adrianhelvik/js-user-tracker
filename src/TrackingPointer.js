module.exports = function TrackingPointer() {

    // Interface
    // ---------

    var self = {
        element: createPointer(),
        toDOM: toDOM,
        fromDOM: fromDOM,
        moveTo: moveTo,
        performClick: performClick
    }

    return self;

    // Implementation
    // --------------

    function toDOM() {
        document.body.appendChild(self.element);
        return self;
    }

    function fromDOM() {
        document.body.removeChild(self.element);
        return self;
    }

    function moveTo(x, y) {
        self.element.style.left = x + 'px';
        self.element.style.top = y + 'px';
    }

    function performClick() {
        var child = self.element.appendChild( createDot('100px', 1, '#0f0') );
        setTimeout( function () {
            self.element.removeChild(child);
        }, 100 )
    }

    // Helper functions
    // ----------------

    function createPointer() {
        var pointer = document.createElement('div');
        pointer.style.position = 'absolute';
        pointer.style.top = 0;
        pointer.style.left = 0;
        pointer.appendChild( createDot('40px', 0.2) );
        pointer.appendChild( createDot('5px', 1) );
        return pointer;
    }

    function createDot(radius, opacity, color) {
        var dot = document.createElement('div');
        dot.classList.add('tracking-dot');
        dot.style.backgroundColor = color || '#f00';
        dot.style.width = radius;
        dot.style.height = radius;
        dot.style.borderRadius = radius;
        dot.style.opacity = opacity;
        dot.style.position = 'absolute';
        dot.style.top = '50%';
        dot.style.left = '50%';
        dot.style.transform = 'translate(-50%, -50%)'
        return dot;
    }
}
