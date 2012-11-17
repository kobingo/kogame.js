var ko = (function (ko) {
    ko.Transition = function (args) {
        args = args || {};
        if (!args.fromScene) {
            throw new Error("'fromScene' have not been specified when creating transition");
        }
        if (!args.inDuration && !args.outDuration) {
            throw new Error("Both 'inDuration' and 'outDuration' can not be empty when creating transition");
        }
        ko.Scene.call(this);
        this.fromScene = args.fromScene;
        this.toScene = args.toScene;
        this.inDuration = args.inDuration;
        this.outDuration = args.outDuration;
        this.transitionValue = 0;
        var self = this;
        var transitionOutBegin = new ko.Call(function () {
            self.state = ko.transitionState.OUT;
            if (args.transitionOut) {
                args.transitionOut(self.outDuration);
            }
        });
        this.transitionOut = new ko.Action(args.outDuration);
        var wait = new ko.Wait(args.waitDuration || 0);
        var transitionInBegin = new ko.Call(function () {
            self.state = ko.transitionState.IN;
            if (args.transitionIn) {
                args.transitionIn(self.inDuration);
            }
        });
        this.transitionIn = new ko.Action(args.inDuration);
        var complete = new ko.Call(function () {
            if (!self.toScene) {
                throw new Error("'toScene' must have been set when transition is complete");
            }
            ko.director.scene = self.toScene;
            self.state = ko.transitionState.COMPLETE;
        });
        var sequence = new ko.Sequence([
            transitionOutBegin,
            this.transitionOut,
            wait,
            transitionInBegin,
            this.transitionIn,
            complete
        ], 1);
        this.perform(sequence);
    };
    ko.Transition.prototype = Object.create(ko.Scene.prototype);
    ko.Transition.prototype.update = function (delta) {
        ko.Scene.prototype.update.call(this, delta);
        switch (this.state) {
            case ko.transitionState.OUT:
                this.transitionValue = this.transitionOut.value;
                break;
            case ko.transitionState.IN:
                this.transitionValue = this.transitionIn.value;
                break;
        }
        if (this.fromScene) {
            this.fromScene.update(delta);
        }
        if (this.toScene) {
            this.toScene.update(delta);
        }
    };
    ko.Transition.prototype.render = function () {
        ko.Scene.prototype.render.call(this);
        if (this.fromScene) {
            this.fromScene.render();
        }
        if (this.toScene) {
            this.toScene.render();
        }
    };
    ko.transitionState = {
        OUT: 0,
        IN: 1,
        COMPLETE: 2
    };
    return ko;
})(ko || {});
