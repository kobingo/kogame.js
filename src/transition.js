var ko = (function (ko) {
    ko.Transition = 
        function (scene, duration, transitionOut, transitionIn, wait) {
        if (!scene) {
            throw new Error("'scene' have not been specified when creating " +
                "transition");
        }
        if (!ko.director.scene) {
            throw new Error("'ko.director.scene' can not be empty when " +
                "creating transition");
        }
        ko.Scene.call(this);
        this.fromScene = ko.director.scene;
        this.toScene = scene;
        // The duration is meant to be specified as the total duration for the 
        // transition. The duration is split up among transition-in/out.
        duration = duration / 2;
        var self = this;
        var transitionComplete = new ko.Call(function () {
            ko.director.scene = self.toScene;
        });
        this.sequence(1).
            call(transitionOut).
            wait(duration).
            wait(wait).
            call(transitionIn).
            wait(duration).
            action(transitionComplete).
            init(this);
        this.onDraw = function () {
            if (this.fromScene) {
                this.fromScene.draw();
            }
            if (this.toScene) {
                this.toScene.draw();
            }
        };
    };
    ko.Transition.prototype = Object.create(ko.Scene.prototype);
    ko.Transition.prototype.update = function (delta) {
        ko.Scene.prototype.update.call(this, delta);
        if (this.fromScene) {
            this.fromScene.update(delta);
        }
        if (this.toScene) {
            this.toScene.update(delta);
        }
    };
    return ko;
})(ko || {});
