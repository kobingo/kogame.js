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
        this.onUpdate = args.onUpdate || function (delta) {};
        this.onHandleInput = args.onHandleInput || function () {};
        this.onDraw = args.onDraw || function () {};
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
        this.onUpdate(delta);
    };
    ko.Node.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        ko.graphics.beginTransform(this);
        this.onDraw();
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].draw();
        }
        ko.graphics.endTransform();
    };
    ko.Node.prototype.handleInput = function () {
        this.onHandleInput();
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
    ko.Node.prototype.getAllChildren = function () {
        var _children = [];
        var _getAllChildren = function (parent) {
            for (var i = 0; i < parent.children.length; i++) {
                _children.push(parent.children[i]);
                _getAllChildren(parent.children[i]);
            }
        };
        _getAllChildren(this);
        return _children;
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
    ko.Node.prototype.moveTo = function (x, y, duration, actionEase) {
        this.performAction(new ko.MoveTo(x, y, duration, actionEase));
        return this;
    };
    ko.Node.prototype.moveBy = function (x, y, duration, actionEase) {
        this.performAction(new ko.MoveBy(x, y, duration, actionEase));
        return this;
    };
    ko.Node.prototype.scaleTo = function (scaleTo, duration, actionEase) {
        this.performAction(new ko.ScaleTo(scaleTo, duration, actionEase));
        return this;
    };
    ko.Node.prototype.scaleBy = function (scaleBy, duration, actionEase) {
        this.performAction(new ko.ScaleBy(scaleBy, duration, actionEase));
        return this;
    };
    ko.Node.prototype.rotateTo = function (rotateTo, duration, actionEase) {
        this.performAction(new ko.RotateTo(rotateTo, duration, actionEase));
        return this;
    };
    ko.Node.prototype.rotateBy = function (rotateBy, duration, actionEase) {
        this.performAction(new ko.RotateBy(rotateBy, duration, actionEase));
        return this;
    };
    ko.Node.prototype.fadeTo = function (fadeTo, duration, actionEase) {
        this.performAction(new ko.FadeTo(fadeTo, duration, actionEase));
        return this;
    };
    ko.Node.prototype.fadeBy = function (fadeBy, duration, actionEase) {
        this.performAction(new ko.FadeBy(fadeBy, duration, actionEase));
        return this;
    };
    ko.Node.prototype.performSequence = function (repeat) {
        var sequence = new ko.Sequence([], repeat);
        this.performAction(sequence);
        return sequence;
    };
    ko.Node.prototype.isColliding = function (node, separate, collisionType) {
        collisionType = collisionType || ko.collisionType.BOX;
        switch (collisionType) {
            case ko.collisionType.BOX:
                return ko.isBoundingBoxIntersecting(this, node, separate);
            case ko.collisionType.SPHERE:
                return ko.isBoundingSphereIntersecting(this, node, separate);
        }
        return false;
    };
    ko.Node.prototype.setPosition = function (position) {
        this.position = { x: position.x, y: position.y };
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
