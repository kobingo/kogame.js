var ko = (function (ko) {
    var isButtonDown;
    var wasButtonPressed;
    var Mouse = function () {
        var self = this;
        this.position = { x: 0, y: 0 };
        this.moved = { x: 0, y: 0 };
        /*global window*/
        window.addEventListener('mousemove', function (event) {
            if (self.position.x !== 0) {
                self.moved.x = event.offsetX - self.position.x;
            }
            if (self.position.y !== 0) {
                self.moved.y = event.offsetY - self.position.y;
            }
            self.position.x = event.offsetX;
            self.position.y = event.offsetY;
        }, false);
        window.addEventListener('mousedown', function (event) {
            if (!isButtonDown) {
                wasButtonPressed = true;
            }
            isButtonDown = true;
        }, false);
        window.addEventListener('mouseup', function (event) {
            isButtonDown = false;
        }, false);
    };
    Mouse.prototype.update = function () {
        this.moved.x = 0;
        this.moved.y = 0;
        wasButtonPressed = false;
    };
    Mouse.prototype.isButtonDown = function () {
        return isButtonDown;
    };
    Mouse.prototype.wasButtonPressed = function () {
        return wasButtonPressed;
    };
    ko.mouse = new Mouse();
    return ko;
})(ko || {});
