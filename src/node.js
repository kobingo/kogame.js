var ko = (function (ko) {
    ko.Node = function (update) {
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
        this._children = [];
        this._actions = [];
        this._update = update || function (delta) {};
        this._render = function () {};
    };
    ko.Node.prototype.update = function (delta) {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        var i;
        for (i = 0; i < this._actions.length; i++) {
            this._actions[i].update(delta);
        }
        for (i = 0; i < this._children.length; i++) {
            this._children[i].update(delta);
        }
        this._update(delta);
    };
    ko.Node.prototype.render = function () {
        if (!this.visible) {
            return;
        }
        ko.renderer.beginTransform(this);
        this._render();
        this.renderChildren();
        ko.renderer.endTransform();
    };
    ko.Node.prototype.renderChildren = function () {
        for (var i = 0; i < this._children.length; i++) {
            this._children[i].render();
        }
    };
    ko.Node.prototype.addChild = function (child) {
        if (child === this) {
            throw new Error("Can't add a child to itself");
        }
        if (child.parent) {
            throw new Error("Child already has a parent");
        }
        this._children.push(child);
        child.parent = this;
    };
    ko.Node.prototype.perform = function (action) {
        if (action.target) {
            throw new Error("Action is already in use");
        }
        action.init(this);
        this._actions.push(action);
    };
    ko.Node.prototype.moveTo = function (x, y, duration, ease) {
        this.perform(new ko.MoveTo(x, y, duration, ease));
        return this;
    };
    ko.Node.prototype.scaleTo = function (scaleTo, duration, ease) {
        this.perform(new ko.ScaleTo(scaleTo, duration, ease));
        return this;
    };
    ko.Node.prototype.rotateTo = function (rotateTo, duration, ease) {
        this.perform(new ko.RotateTo(rotateTo, duration, ease));
        return this;
    };
    ko.Node.prototype.fadeTo = function (fadeTo, duration, ease) {
        this.perform(new ko.FadeTo(fadeTo, duration, ease));
        return this;
    };
    ko.Node.prototype.sequence = function (repeat) {
        var sequence = new ko.Sequence([], repeat);
        this._actions.push(sequence);
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
    return ko;
})(ko || {});
