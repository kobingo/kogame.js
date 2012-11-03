var ko = (function (ko) {
    ko.Sequence = function (actions, repeatCount) {
        this._actions = actions;
        this.repeatCount = repeatCount;
    };
    ko.Sequence.prototype.init = function (target) {
        this.actionIndex = 0;
        this.loopCount = 0;
        this._actions[0].init(target);
        this.target = target;
    };
    ko.Sequence.prototype.update = function (delta) {
        if (this.loopCount >= this.repeatCount) {
            return;
        }
        var currentAction = this._actions[this.actionIndex];
        if (currentAction.isComplete()) {
            this.nextAction();
        }
        currentAction = this._actions[this.actionIndex];
        currentAction.update(delta);
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
    return ko;
})(ko || {});
