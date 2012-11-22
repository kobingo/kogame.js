var ko = (function (ko) {
    ko.Node = function (args) {
        args = args || {};
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.color = 'rgb(255,255,255)';
        this.opacity = 1;
        this.rotation = 0;
        this.scale = 1;
        this.anchor = { x: 0, y: 0 };
        this.size = { width: 0, height: 0 };
        this.visible = true;
        this.active = true;
        this.children = [];
        this.actions = [];
        this._update = args.update || function (delta) {};
        this._handleInput = args.handleInput || function () {};
        this._draw = args.draw || function () {};
    };
    ko.Node.prototype.update = function (delta) {
        if (!this.active) {
            return;
        }
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        var i;
        for (i = 0; i < this.actions.length; i++) {
            this.actions[i].update(delta);
        }
        for (i = this.actions.length - 1; i >= 0; i--) {
            if (this.actions[i].isComplete()) {
                this.actions[i].target = null;
                this.actions.splice(i, 1);
            }
        }
        for (i = 0; i < this.children.length; i++) {
            this.children[i].update(delta);
        }
        this._update(delta);
    };
    ko.Node.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        ko.graphics.beginTransform(this);
        this._draw();
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].draw();
        }
        ko.graphics.endTransform();
    };
    ko.Node.prototype.handleInput = function () {
        this._handleInput();
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].handleInput();
        }
    };
    ko.Node.prototype.addChild = function (child) {
        if (child === this) {
            throw new Error("Can't add a child to itself");
        }
        if (child.parent) {
            throw new Error("Child already has a parent");
        }
        this.children.push(child);
        child.parent = this;
    };
    ko.Node.prototype.performAction = function (action) {
        if (action.target) {
            throw new Error("Action is already in use");
        }
        action.init(this);
        this.actions.push(action);
    };
    ko.Node.prototype.stopAction = function (action) {
        var index = this.actions.indexOf(action);
        if (index < 0) {
            return;
        }
        this.actions[index].target = null;
        this.actions.splice(index, 1);
    };
    ko.Node.prototype.moveTo = function (x, y, duration, ease) {
        this.performAction(new ko.MoveTo(x, y, duration, ease));
        return this;
    };
    ko.Node.prototype.scaleTo = function (scaleTo, duration, ease) {
        this.performAction(new ko.ScaleTo(scaleTo, duration, ease));
        return this;
    };
    ko.Node.prototype.rotateTo = function (rotateTo, duration, ease) {
        this.performAction(new ko.RotateTo(rotateTo, duration, ease));
        return this;
    };
    ko.Node.prototype.fadeTo = function (fadeTo, duration, ease) {
        this.performAction(new ko.FadeTo(fadeTo, duration, ease));
        return this;
    };
    ko.Node.prototype.sequence = function (repeat) {
        var sequence = new ko.Sequence([], repeat);
        this.actions.push(sequence);
        return sequence;
    };
    ko.Node.prototype.isColliding = function (node, separate) {
        if (!this.boundingBox) {
            this.boundingBox = new ko.BoundingBox(this);
        }
        if (!node.boundingBox) {
            node.boundingBox = new ko.BoundingBox(node);
        }
        return this.boundingBox.isIntersecting(node.boundingBox, separate);
    };
    ko.Node.prototype.centerPosition = function () {
        var center = ko.graphics.center;
        this.position = { x: center.x, y: center.y };
    };
    ko.Node.prototype.centerAnchor = function () {
        this.anchor = { x: 0.5, y: 0.5 };
    };
    return ko;
})(ko || {});
