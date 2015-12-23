module.exports = function MessageBox(message, duration) {

    // Interface
    // ---------

    var self = {
        message  : message,
        element  : null,
        duration : verifyPositiveNumber(duration, { default: 1000 })
    };

    // Initialization
    // --------------
    createElement();
    styleElement();
    display();

    return self;

    // Implementation
    // --------------

    function display() {
        document.body.appendChild(self.element);

        setTimeout( function() {
            document.body.removeChild(self.element);
        }, self.duration );
    }

    function fromDOM() {
    }

    function createElement() {
        self.element = document.createElement('div');
        self.element.innerHTML = self.message;
        styleElement();
    }

    function styleElement() {
        self.element.style.top             = '50%';
        self.element.style.position        = 'fixed';
        self.element.style.left            = '50%';
        self.element.style.transform       = 'translate(-50%, -50%)';
        self.element.style.backgroundColor = '#ff0';
        self.element.style.padding         = '1em';
        self.element.style.fontWeight      = 'bold';
        self.element.style.fontFamily      = 'sans-serif';
        self.element.style.fontSize        = '3em';
    }

    // Helper functions
    // ----------------

    function verifyPositiveNumber(number, options) {
        if (typeof number === 'number')
            return number;
        return options.default;
    }
}
