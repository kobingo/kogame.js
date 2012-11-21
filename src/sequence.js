var ko = (function (ko) {
    ko.Sequence = function (actions, repeatCount) {
        this.actions = actions;
        this.repeatCount = repeatCount;
        this.actionIndex = 0;
        this.repeatIndex = 0;
    };
    ko.Sequence.prototype = Object.create(ko.Action.prototype);
    ko.Sequence.prototype.init = function (target) {
        this.actionIndex = 0;
        this.repeatIndex = 0;
        if (this.actions.length > 0) {
            this.actions[0].init(target);
        }
        this.target = target;
    };
    ko.Sequence.prototype.update = function (delta) {
        if (this.actions.length === 0) {
            return;
        }
        if (this.repeatIndex >= this.repeatCount) {
            return;
        }
        var currentAction = this.actions[this.actionIndex];
        currentAction.update(delta);
        var durationIsZero;
        while (currentAction.isComplete()) {
            this.nextAction();
            // When we have repeated enough times we want to return immediatly
            if (this.repeatIndex >= this.repeatCount) {
                return;
            }
            currentAction = this.actions[this.actionIndex];
            currentAction.init(this.target);
            if (!currentAction.duration) {
                currentAction.update(delta);
            }
        }
    };
    ko.Sequence.prototype.isComplete = function () {
        if (!this.repeatCount) {
            return false;
        }
        return this.repeatIndex >= this.repeatCount;
    };
    ko.Sequence.prototype.nextAction = function () {
        this.actionIndex++;
        if (this.actionIndex >= this.actions.length) {
            this.actionIndex = 0;
            this.repeatIndex++;
        }
        this.actions[this.actionIndex].init(this.target);
    };
    ko.Sequence.prototype.action = function (action) {
        this.actions.push(action);
        return this;
    };
    ko.Sequence.prototype.moveTo = function (x, y, duration, ease) {
        this.actions.push(new ko.MoveTo(x, y, duration, ease));
        return this;
    };
    ko.Sequence.prototype.scaleTo = function (scaleTo, duration, ease) {
        this.actions.push(new ko.ScaleTo(scaleTo, duration, ease));
        return this;
    };
    ko.Sequence.prototype.rotateTo = function (rotateTo, duration, ease) {
        this.actions.push(new ko.RotateTo(rotateTo, duration, ease));
        return this;
    };
    ko.Sequence.prototype.fadeTo = function (fadeTo, duration, ease) {
        this.actions.push(new ko.FadeTo(fadeTo, duration, ease));
        return this;
    };
    ko.Sequence.prototype.wait = function (duration) {
        this.actions.push(new ko.Wait(duration));
        return this;
    };
    ko.Sequence.prototype.call = function (func, args) {
        this.actions.push(new ko.Call(func, args));
        return this;
    };
    return ko;
})(ko || {});
