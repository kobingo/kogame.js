var ko = (function (ko) {
    var keyDown = {};
    var keyPressed = {};
    var keyHeld = {};
    var Keyboard = function () {
        this.ENTER = 13;
        this.ESCAPE = 27;
        this.SPACE = 32;
        this.LEFT = 37;
        this.UP = 38;
        this.RIGHT = 39; 
        this.DOWN = 40;
        /*global window*/
        window.addEventListener('keydown', function (event) {
            if (!keyDown[event.keyCode]) {
                keyPressed[event.keyCode] = true;
            }
            keyDown[event.keyCode] = true;
            keyHeld[event.keyCode] = true;
        }, false);
        window.addEventListener('keyup', function (event) {
            keyDown[event.keyCode] = false;
        }, false);
    };
    Keyboard.prototype.update = function () {
        keyPressed = {};
        keyHeld = {};
    };
    Keyboard.prototype.isKeyDown = function (key) {
        return keyDown[key];
    };
    Keyboard.prototype.wasKeyPressed = function (key) {
        return keyPressed[key];
    };
    Keyboard.prototype.wasKeyHeld = function (key) {
        return keyHeld[key];
    };
    ko.keyboard = new Keyboard();
    return ko;
})(ko || {});
