var ko = (function (ko) {
    /*global window*/
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            // For browsers that doesn't support requestAnimationFrame
            window.setTimeout(callback, 1000 / 60);
        };
    var performance = window.performance || {};
    performance.now = 
        performance.now ||
        performance.webkitNow ||
        performance.mozNow ||
        performance.oNow ||
        performance.msNow ||
        function () {
            // For browsers that doesn't support performance.now
            return new Date().getTime();
        };
    var lastTime = performance.now();
    var timeAccumulator = 0;
    var tick = function () {
        var currentTime = performance.now();
        var frameTime = currentTime - lastTime;
        lastTime = currentTime;
        timeAccumulator += frameTime;
        while (timeAccumulator >= ko.game.targetDelta) {
            ko.game.update(ko.game.targetDelta * 0.001);
            timeAccumulator -= ko.game.targetDelta;
        }
        ko.game.draw();
        requestAnimationFrame(tick);
    };
    var canvas;
    var Game = function () {
        this.targetDelta = 1000 / 60;
    };
    Game.prototype.init = function (canvasId) {
        /*global document*/
        canvas = document.getElementById(canvasId);
        if (!canvas) {
            throw new Error("Couldn't find canvas '" + canvasId + "'");
        }
        ko.graphics.init(canvas);
        ko.mouse.init(canvas);
        this.initialized = true;
    };
    Game.prototype.run = function (scene) {
        if (!this.initialized) {
            throw new Error("Game has not been initialized");
        }
        ko.director.scene = scene;
        requestAnimationFrame(tick);
    };
    Game.prototype.update = function (delta) {
        ko.director.update(delta);
        ko.keyboard.update();
        ko.mouse.update();
        ko.audio.update(delta);
    };
    Game.prototype.draw = function () {
        ko.graphics.clear();
        ko.director.draw();
    };
    Game.prototype.toggleFullscreen = function () {
        if (!canvas) {
            return;
        }
        var requestFullScreen = 
            canvas.requestFullScreen ||
            canvas.webkitRequestFullScreen ||
            canvas.mozRequestFullScreen ||
            canvas.oRequestFullScreen ||
            canvas.msRequestFullScreen;
        var isFullScreen = 
            document.isFullScreen ||
            document.webkitIsFullScreen ||
            document.mozIsFullScreen ||
            document.oIsFullScreen ||
            document.msIsFullScreen;
        var cancelFullScreen = 
            document.cancelFullScreen ||
            document.webkitCancelFullScreen ||
            document.mozCancelFullScreen ||
            document.oCancelFullScreen ||
            document.msCancelFullScreen;
        if (!isFullScreen && requestFullScreen) {
            requestFullScreen.call(canvas);
        } else if (cancelFullScreen){
            cancelFullScreen.call(document);
        }
    };
    Game.prototype.autoCenterAndScaleToFit = function () {
        window.addEventListener("resize", function () {
            _autoCenterAndScaleToFit();
        }); 
        var _autoCenterAndScaleToFit = function () {
            if (!canvas) {
                return;
            }
            var ratio = Math.min(window.innerWidth / canvas.width, 
                window.innerHeight / canvas.height);
            canvas.style.width = canvas.width * ratio + "px";
            canvas.style.height = canvas.height * ratio + "px";
            canvas.style.position = "absolute";
            canvas.style.left = (window.innerWidth - 
                canvas.width * ratio) / 2 + "px";
            canvas.style.top = (window.innerHeight - 
                canvas.height * ratio) / 2 + "px";
        };
        _autoCenterAndScaleToFit();
    };
    ko.game = new Game();
    return ko;
})(ko || {});
