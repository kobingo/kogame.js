var ko = (function (ko) {
    ko.Transition = 
        function (fromScene, toScene, duration, transitionOut, transitionIn, wait) {
        if (!fromScene) {
            throw new Error("'fromScene' have not been specified when creating " +
                "transition");
        }
        if (!toScene) {
            throw new Error("'toScene' have not been specified when creating " +
                "transition");
        }
        ko.Scene.call(this);
        this.fromScene = fromScene;
        this.toScene = toScene;
        // The duration is meant to be specified as the total duration for the 
        // transition. The duration is split up among transition-in/out.
        duration = duration / 2;
        var self = this;
        var transitionComplete = new ko.Call(function () {
            ko.director.scene = self.toScene;
        });
        this.performSequence(1).
            call(transitionOut).
            wait(duration).
            wait(wait).
            call(transitionIn).
            wait(duration).
            action(transitionComplete);
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
