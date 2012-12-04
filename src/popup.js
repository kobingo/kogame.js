var ko = (function (ko) {
    ko.Popup = function (fromScene, toScene, duration, transitionOut, 
        transitionIn) {
        if (!fromScene) {
            throw new Error("'fromScene' have not been specified when " + 
                "creating popup");
        }
        if (!toScene) {
            throw new Error("'toScene' have not been specified when " + 
                "creating popup");
        }
        ko.Scene.call(this);
        this.fromScene = fromScene;
        this.toScene = toScene;
        this.duration = duration;
        this.transitionOut = transitionOut;
        this.sequence(1).
            call(transitionIn).
            wait(duration).
            init(this);
        this.onDraw = function () {
            this.fromScene.draw();
            this.toScene.draw();
        };
    };
    ko.Popup.prototype = Object.create(ko.Scene.prototype);
    ko.Popup.prototype.update = function (delta) {
        ko.Scene.prototype.update.call(this, delta);
        this.fromScene.update(delta);
        this.toScene.update(delta);
    };
    ko.Popup.prototype.handleInput = function () {
        ko.Scene.prototype.handleInput.call(this);
        this.toScene.handleInput();
    };
    ko.Popup.prototype.close = function () {
        var self = this;
        var transitionComplete = new ko.Call(function () {
            ko.director.scene = self.fromScene;
        });
        this.sequence(1).
            call(self.transitionOut).
            wait(this.duration).
            action(transitionComplete).
            init(this);
    };
    return ko;
})(ko || {});
