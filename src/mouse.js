var ko = (function (ko) {
    var buttonDown;
    var buttonPressed;
    ko.Mouse = function () {
        var self = this;
        this.position = { x: 0, y: 0 };
        this.local = { x: 0, y: 0 };
        this.moved = { x: 0, y: 0 };
        this.hasEntered = false;
        /*global window*/
        window.addEventListener('mousemove', function (event) {
            if (self.position.x !== 0) {
                self.moved.x = event.offsetX - self.position.x;
            }
            if (self.position.y !== 0) {
                self.moved.y = event.offsetY - self.position.y;
            }
            self.position.x = event.clientX;
            self.position.y = event.clientY;
        }, false);
        window.addEventListener('mousedown', function (event) {
            if (!buttonDown) {
                buttonPressed = true;
            }
            buttonDown = true;
        }, false);
        window.addEventListener('mouseup', function (event) {
            buttonDown = false;
        }, false);
    };
    ko.Mouse.prototype.init = function (canvas) {
        var self = this;
        canvas.addEventListener('mousemove', function (event) {
            self.local.x = event.offsetX;
            self.local.y = event.offsetY;
        }, false);
        canvas.addEventListener('mouseover', function (event) {
            self.hasEntered = true;
        }, false);
        canvas.addEventListener('mouseout', function (event) {
            self.hasEntered = false;
        }, false);
    };
    ko.Mouse.prototype.update = function () {
        this.moved.x = 0;
        this.moved.y = 0;
        buttonPressed = false;
    };
    ko.Mouse.prototype.isButtonDown = function () {
        return buttonDown;
    };
    ko.Mouse.prototype.wasButtonPressed = function () {
        return buttonPressed;
    };
    ko.mouse = new ko.Mouse();
    return ko;
})(ko || {});
