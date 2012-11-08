var ko = (function (ko) {
    ko.Sequence = function (actions, repeatCount) {
        this._actions = actions;
        this.repeatCount = repeatCount;
        this.actionIndex = 0;
        this.loopCount = 0;
    };
    ko.Sequence.prototype = Object.create(ko.Action.prototype);
    ko.Sequence.prototype.init = function (target) {
        this.actionIndex = 0;
        this.loopCount = 0;
        if (this._actions.length > 0) {
            this._actions[0].init(target);
        }
        this.target = target;
    };
    ko.Sequence.prototype.update = function (delta) {
        if (this._actions.length === 0) {
            return;
        }
        if (this.loopCount >= this.repeatCount) {
            return;
        }
        var currentAction = this._actions[this.actionIndex];
        currentAction.update(delta);
        while (currentAction.isComplete()) {
            this.nextAction();
            currentAction = this._actions[this.actionIndex];
            if (!currentAction.duration) {
                currentAction.update(delta);
            }
        }
    };
    ko.Sequence.prototype.isComplete = function () {
        if (!this.repeatCount) {
            return false;
        }
        return this.loopCount >= this.repeatCount;
    };
    ko.Sequence.prototype.nextAction = function () {
        this.actionIndex++;
        if (this.actionIndex >= this._actions.length) {
            this.actionIndex = 0;
            this.loopCount++;
        }
        this._actions[this.actionIndex].init(this.target);
    };
    ko.Sequence.prototype.moveTo = function (x, y, duration, ease) {
        this._actions.push(new ko.MoveTo(x, y, duration, ease));
        return this;
    };
    ko.Sequence.prototype.scaleTo = function (scaleTo, duration, ease) {
        this._actions.push(new ko.ScaleTo(scaleTo, duration, ease));
        return this;
    };
    ko.Sequence.prototype.rotateTo = function (rotateTo, duration, ease) {
        this._actions.push(new ko.RotateTo(rotateTo, duration, ease));
        return this;
    };
    ko.Sequence.prototype.fadeTo = function (fadeTo, duration, ease) {
        this._actions.push(new ko.FadeTo(fadeTo, duration, ease));
        return this;
    };
    ko.Sequence.prototype.wait = function (duration) {
        this._actions.push(new ko.Wait(duration));
        return this;
    };
    return ko;
})(ko || {});
