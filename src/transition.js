var ko = (function (ko) {
    ko.Transition = function (args) {
        if (!args.fromScene) {
            throw new Error("Must specify a scene to transition from");
        }
        if (!args.toScene) {
            throw new Error("Must specify a scene to transition to");
        }
        if (!args.duration1) {
            throw new Error("Must specify a duration");
        }
        ko.Scene.call(this);
        this.fromScene = args.fromScene;
        this.toScene = args.toScene;
        this.duration1 = args.duration1;
        this.duration2 = args.duration2;
        this.transitionValue = 0;
        var self = this;
        var transition1Begin = new ko.Call(function () {
            self.state = ko.transitionState.TRANSITION1;
            if (args.transition1) {
                args.transition1(self.duration1);
            }
        });
        this.transition1 = new ko.Action(args.duration1);
        var wait = new ko.Wait(args.wait || 0);
        var transition2Begin = new ko.Call(function () {
            self.state = ko.transitionState.TRANSITION2;
            if (args.transition2) {
                args.transition2(self.duration2);
            }
        });
        this.transition2 = new ko.Action(args.duration2);
        var complete = new ko.Call(function () {
            ko.director.scene = self.toScene;
        });
        var sequence = new ko.Sequence([
            transition1Begin,
            this.transition1,
            wait,
            transition2Begin,
            this.transition2,
            complete
        ], 1);
        this.perform(sequence);
    };
    ko.Transition.prototype = Object.create(ko.Scene.prototype);
    ko.Transition.prototype.update = function (delta) {
        ko.Scene.prototype.update.call(this, delta);
        switch (this.state) {
            case ko.transitionState.TRANSITION1:
                this.transitionValue = this.transition1.value;
                break;
            case ko.transitionState.TRANSITION2:
                this.transitionValue = this.transition2.value;
                break;
        }
        this.fromScene.update(delta);
        this.toScene.update(delta);
    };
    ko.Transition.prototype.render = function () {
        ko.Scene.prototype.render.call(this);
        this.fromScene.render();
        this.toScene.render();
    };
    ko.transitionState = {
        TRANSITION1: 0,
        TRANSITION2: 1
    };
    return ko;
})(ko || {});
