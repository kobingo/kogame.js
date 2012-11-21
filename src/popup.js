var ko = (function (ko) {
    ko.Popup = function (scene, duration, transitionOut, transitionIn) {
        if (!scene) {
            throw new Error("'scene' have not been specified when " + 
                "creating popup");
        }
        if (!ko.director.scene) {
            throw new Error("'ko.director.scene' can not be empty when " +
                "creating popup");
        }
        ko.Scene.call(this);
        this.fromScene = ko.director.scene;
        this.toScene = scene;
        this.duration = duration;
        this.transitionOut = transitionOut;
        this.sequence(1).
            call(transitionIn).
            wait(duration).
            init(this);
    };
    ko.Popup.prototype = Object.create(ko.Scene.prototype);
    ko.Popup.prototype.update = function (delta) {
        ko.Scene.prototype.update.call(this, delta);
        this.fromScene.update(delta);
        this.toScene.update(delta);
    };
    ko.Popup.prototype.draw = function () {
        ko.Scene.prototype.draw.call(this);
        this.fromScene.draw();
        this.toScene.draw();
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
