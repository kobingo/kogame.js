var ko = (function (ko) {
    ko.Transition = function (args) {
        args = args || {};
        if (!args.fromScene) {
            throw new Error("'fromScene' have not been specified when creating transition");
        }
        if (!args.outDuration && !args.inDuration) {
            throw new Error("Both 'inDuration' and 'outDuration' can not be empty when creating transition");
        }
        ko.Scene.call(this);
        this.fromScene = args.fromScene;
        this.toScene = args.toScene;
        var self = this;
        var transitionOut = new ko.Call(function () {
            self.state = ko.transitionState.OUT;
            if (args.transitionOut) {
                args.transitionOut(self.outDuration);
            }
        });
        var transitionIn = new ko.Call(function () {
            self.state = ko.transitionState.IN;
            if (args.transitionIn) {
                args.transitionIn(self.inDuration);
            }
        });
        var transitionComplete = new ko.Call(function () {
            if (!self.toScene) {
                throw new Error("'toScene' must have been set when transition is complete");
            }
            ko.director.scene = self.toScene;
            self.state = ko.transitionState.COMPLETE;
        });
        this.sequence(1).
            action(transitionOut).
            wait(args.outDuration).
            wait(args.waitDuration).
            action(transitionIn).
            wait(args.inDuration).
            action(transitionComplete).
            init(this);
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
    ko.Transition.prototype.draw = function () {
        ko.Scene.prototype.draw.call(this);
        if (this.fromScene) {
            this.fromScene.draw();
        }
        if (this.toScene) {
            this.toScene.draw();
        }
    };
    ko.transitionState = {
        IN: 0,
        OUT: 1,
        COMPLETE: 2
    };
    ko.Popup = function (args) {
        ko.Scene.call(this);
        this.fromScene = args.fromScene;
        this.toScene = args.toScene;
        this.duration = args.duration;
        this.transitionOut = args.transitionOut;
        var self = this;
        var transitionIn = new ko.Call(function () {
            self.state = ko.transitionState.IN;
            if (args.transitionIn) {
                args.transitionIn(self.duration);
            }
        });
        this.sequence(1).
            action(transitionIn).
            wait(args.duration).
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
        var transitionOut = new ko.Call(function () {
            self.state = ko.transitionState.OUT;
            if (self.transitionOut) {
                self.transitionOut(self.duration);
            }
        });
        var transitionComplete = new ko.Call(function () {
            self.state = ko.transitionState.COMPLETE;
            ko.director.scene = self.fromScene;
        });
        this.sequence(1).
            action(transitionOut).
            wait(this.duration).
            action(transitionComplete).
            init(this);
    };
    return ko;
})(ko || {});
