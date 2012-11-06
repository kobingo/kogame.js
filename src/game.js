var ko = (function (ko) {
    /*global window*/
    var _animationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    var _animate = function () {
        ko.game.update(0.016);
        _animationFrame(_animate);
    };
    var Game = function () {
    };
    Game.prototype.init = function (canvasId) {
        /*global document*/
        var canvas = document.getElementById(canvasId);
        if (!canvas) {
            throw new Error("Couldn't find canvas '" + canvasId + "'");
        }
        ko.renderer = new ko.Renderer(canvas);
        this.initialized = true;
    };
    Game.prototype.run = function (scene) {
        if (!this.initialized) {
            throw new Error("Game has not been initialized");
        }
        ko.director.scene = scene;
        _animationFrame(_animate);
    };
    Game.prototype.update = function (delta) {
        ko.director.update(delta);
        ko.renderer.clear();
        ko.director.render();
        ko.keyboard.update();
        ko.mouse.update();
    };
    ko.game = new Game();
    return ko;
})(ko || {});
