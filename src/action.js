var ko = (function (ko) {
    ko.Action = function (duration, ease) {
        this.duration = duration;
        this.ease = ease;
        this.value = 0;
        this.elapsed = 0;
    };
    ko.Action.prototype.init = function (target) {
        this.value = 0;
        this.target = target;
        this.elapsed = 0;
    };
    ko.Action.prototype.update = function (delta) {
        if (!this.target) {
            throw new Error("Action has not been initialized with a target");
        }
        if (!this.duration) {
            // When the duration is zero we just want to perform the action
            // with a value of one
            this.value = 1;
            this.perform();
            return;
        }
        if (this.isComplete()) {
            // We are already done with this action
            return;
        }
        this.elapsed += delta;
        if (this.elapsed > this.duration) {
            this.elapsed = this.duration;
        }
        if (this.ease) {
            this.value = this.ease(this.elapsed / this.duration);
        } else {
            this.value = Math.max(0, Math.min(1, 
                this.elapsed / this.duration));
        }
        this.perform();
    };
    ko.Action.prototype.perform = function () {
    };
    ko.Action.prototype.isComplete = function () {
        if (!this.duration) {
            return true;
        }
        return this.elapsed >= this.duration;
    };

    ko.MoveTo = function (x, y, duration, ease) {
        ko.Action.call(this, duration, ease);
        this.moveTo = { x: x, y: y };
    };
    ko.MoveTo.prototype = Object.create(ko.Action.prototype);
    ko.MoveTo.prototype.init = function (target) {
        ko.Action.prototype.init.call(this, target);
        this.moveFrom = { 
            x: target.position.x, 
            y: target.position.y 
        };
    };
    ko.MoveTo.prototype.perform = function () {
        this.target.position.x = this.moveFrom.x + 
            ((this.moveTo.x - this.moveFrom.x) * this.value);
        this.target.position.y = this.moveFrom.y + 
            ((this.moveTo.y - this.moveFrom.y) * this.value);
    };

    ko.ScaleTo = function (scaleTo, duration, ease) {
        ko.Action.call(this, duration, ease);
        this.scaleTo = scaleTo;
    };
    ko.ScaleTo.prototype = Object.create(ko.Action.prototype);
    ko.ScaleTo.prototype.init = function (target) {
        ko.Action.prototype.init.call(this, target);
        this.scaleFrom = target.scale;
    };
    ko.ScaleTo.prototype.perform = function () {
        this.target.scale = this.scaleFrom + 
            ((this.scaleTo - this.scaleFrom) * this.value);
    };

    ko.RotateTo = function (rotateTo, duration, ease) {
        ko.Action.call(this, duration, ease);
        this.rotateTo = rotateTo;
    };
    ko.RotateTo.prototype = Object.create(ko.Action.prototype);
    ko.RotateTo.prototype.init = function (target) {
        ko.Action.prototype.init.call(this, target);
        this.rotateFrom = target.rotation;
    };
    ko.RotateTo.prototype.perform = function () {
        this.target.rotation = this.rotateFrom + 
            ((this.rotateTo - this.rotateFrom) * this.value);
    };

    ko.FadeTo = function (fadeTo, duration, ease) {
        ko.Action.call(this, duration, ease);
        this.fadeTo = fadeTo;
    };
    ko.FadeTo.prototype = Object.create(ko.Action.prototype);
    ko.FadeTo.prototype.init = function (target) {
        ko.Action.prototype.init.call(this, target);
        this.fadeFrom = target.opacity;
    };
    ko.FadeTo.prototype.perform = function () {
        this.target.opacity = this.fadeFrom + 
            ((this.fadeTo - this.fadeFrom) * this.value);
    };

    ko.Wait = function (duration) {
        ko.Action.call(this, duration);
    };
    ko.Wait.prototype = Object.create(ko.Action.prototype);

    ko.Call = function (func, args) {
        ko.Action.call(this, 0);
        this.func = func;
        this.args = args;
    };
    ko.Call.prototype = Object.create(ko.Action.prototype);
    ko.Call.prototype.perform = function () {
        this.func(this.args);
    };

    ko.actionEase = {
        backIn: function (t) {
            var overshoot = 1.70158;
            return t * t * ((overshoot + 1) * t - overshoot);
        },
        backOut: function (t) {
            var overshoot = 1.70158;
            t = t - 1;
            return t * t * ((overshoot + 1) * t + overshoot) + 1;
        },
        backInOut: function (t) {
            var overshoot = 1.70158 * 1.525;
            t = t * 2;
            if (t < 1) {
                return (t * t * ((overshoot + 1) * t - overshoot)) / 2;
            } else {
                t = t - 2;
                return (t * t * ((overshoot + 1) * t + overshoot)) / 2 + 1;
            }
        },
        sineIn: function (t) {
            return -1 * Math.cos(t * Math.PI / 2) + 1;
        },
        sineOut: function (t) {
            return Math.sin(t * (Math.PI / 2));
        },
        sineInOut: function (t) {
            return -0.5 * (Math.cos(Math.PI * t) - 1);
        }
    };

    return ko;
})(ko || {});
