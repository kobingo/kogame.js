var ko = (function (ko) {
    /*global window*/
    var animationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    var Game = function () {
    };
    Game.prototype.init = function (canvas) {
        if (!canvas) {
            throw new Error("Can't init game without a canvas.");
        }
        ko.renderer = new ko.Renderer(canvas);
        this.initialized = true;
    };
    Game.prototype.run = function (scene) {
        if (!this.initialized) {
            throw new Error("Game has not been initialized.");
        }
        ko.director.scene = scene;
        animationFrame(this.tick);
    };
    Game.prototype.tick = function () {
        var delta = 0.016;
        ko.director.update(delta);
        ko.renderer.clear();
        ko.director.render();
        ko.keyboard.update();
        ko.mouse.update();
        animationFrame(ko.game.tick);
    };
    ko.game = new Game();
    return ko;
})(ko || {});
