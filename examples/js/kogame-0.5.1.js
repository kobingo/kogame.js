/*! Kogame.js - v0.5.1 - 2012-11-29
* https://github.com/kobingo/kogame.js
* Copyright (c) 2012 Jens Andersson; Licensed MIT */

var ko = (function (ko) {
    /*global window*/
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            // For browsers that doesn't support requestAnimationFrame
            window.setTimeout(callback, 1000 / 60);
        };
    var performance = window.performance || {};
    performance.now = 
        performance.now ||
        performance.webkitNow ||
        performance.mozNow ||
        performance.oNow ||
        performance.msNow ||
        function () {
            // For browsers that doesn't support performance.now
            return new Date().getTime();
        };
    var lastTime = performance.now();
    var timeAccumulator = 0;
    var tick = function () {
        var currentTime = performance.now();
        var frameTime = currentTime - lastTime;
        lastTime = currentTime;
        timeAccumulator += frameTime;
        while (timeAccumulator >= ko.game.targetDelta) {
            ko.game.update(ko.game.targetDelta * 0.001);
            timeAccumulator -= ko.game.targetDelta;
        }
        ko.game.draw();
        requestAnimationFrame(tick);
    };
    var Game = function () {
        this.targetDelta = 1000 / 60;
    };
    Game.prototype.init = function (canvasId) {
        /*global document*/
        var canvas = document.getElementById(canvasId);
        if (!canvas) {
            throw new Error("Couldn't find canvas '" + canvasId + "'");
        }
        ko.graphics.init(canvas);
        ko.mouse.init(canvas);
        this.initialized = true;
    };
    Game.prototype.run = function (scene) {
        if (!this.initialized) {
            throw new Error("Game has not been initialized");
        }
        ko.director.scene = scene;
        requestAnimationFrame(tick);
    };
    Game.prototype.update = function (delta) {
        ko.director.update(delta);
        ko.keyboard.update();
        ko.mouse.update();
        ko.audio.update(delta);
    };
    Game.prototype.draw = function () {
        ko.graphics.clear();
        ko.director.draw();
    };
    ko.game = new Game();
    return ko;
})(ko || {});

var ko = (function (ko) {
    var keyDown = {};
    var keyPressed = {};
    var keyHeld = {};
    var Keyboard = function () {
        this.ENTER = 13;
        this.ESCAPE = 27;
        this.SPACE = 32;
        this.LEFT = 37;
        this.UP = 38;
        this.RIGHT = 39; 
        this.DOWN = 40;
        /*global window*/
        window.addEventListener('keydown', function (event) {
            if (!keyDown[event.keyCode]) {
                keyPressed[event.keyCode] = true;
            }
            keyDown[event.keyCode] = true;
            keyHeld[event.keyCode] = true;
        }, false);
        window.addEventListener('keyup', function (event) {
            keyDown[event.keyCode] = false;
        }, false);
    };
    Keyboard.prototype.update = function () {
        keyPressed = {};
        keyHeld = {};
    };
    Keyboard.prototype.isKeyDown = function (key) {
        return keyDown[key];
    };
    Keyboard.prototype.wasKeyPressed = function (key) {
        return keyPressed[key];
    };
    Keyboard.prototype.wasKeyHeld = function (key) {
        return keyHeld[key];
    };
    ko.keyboard = new Keyboard();
    return ko;
})(ko || {});

var ko = (function (ko) {
    var buttonDown;
    var buttonPressed;
    ko.Mouse = function () {
        var self = this;
        this.position = { x: 0, y: 0 };
        this.local = { x: 0, y: 0 };
        this.moved = { x: 0, y: 0 };
        this.hasEntered = false;
        /*global window*/
        window.addEventListener('mousemove', function (event) {
            if (self.position.x !== 0) {
                self.moved.x = event.offsetX - self.position.x;
            }
            if (self.position.y !== 0) {
                self.moved.y = event.offsetY - self.position.y;
            }
            self.position.x = event.clientX;
            self.position.y = event.clientY;
        }, false);
        window.addEventListener('mousedown', function (event) {
            if (!buttonDown) {
                buttonPressed = true;
            }
            buttonDown = true;
        }, false);
        window.addEventListener('mouseup', function (event) {
            buttonDown = false;
        }, false);
    };
    ko.Mouse.prototype.init = function (canvas) {
        var self = this;
        canvas.addEventListener('mousemove', function (event) {
            self.local.x = event.offsetX;
            self.local.y = event.offsetY;
        }, false);
        canvas.addEventListener('mouseover', function (event) {
            self.hasEntered = true;
        }, false);
        canvas.addEventListener('mouseout', function (event) {
            self.hasEntered = false;
        }, false);
    };
    ko.Mouse.prototype.update = function () {
        this.moved.x = 0;
        this.moved.y = 0;
        buttonPressed = false;
    };
    ko.Mouse.prototype.isButtonDown = function () {
        return buttonDown;
    };
    ko.Mouse.prototype.wasButtonPressed = function () {
        return buttonPressed;
    };
    ko.mouse = new ko.Mouse();
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Graphics2D = function () {
    };
    ko.Graphics2D.prototype.init = function (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.size = { width: canvas.width, height: canvas.height };
        this.center = { x: canvas.width / 2, y: canvas.height / 2};
    };
    ko.Graphics2D.prototype.clear = function (color, opacity) {
        if (opacity === undefined) {
            opacity = 1;
        }
        this.context.globalAlpha = opacity;
        this.context.fillStyle = color || 'rgb(100, 149, 237)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    ko.Graphics2D.prototype.beginTransform = function (node) {
        this.context.save();
        this.context.translate(node.position.x, node.position.y);
        this.context.scale(node.scale, node.scale);
        this.context.rotate(node.rotation);
    };
    ko.Graphics2D.prototype.endTransform = function () {
        this.context.restore();
    };
    ko.Graphics2D.prototype.drawRect = function (node) {
        this.context.globalAlpha = node.opacity;
        this.context.fillStyle = node.color;
        this.context.fillRect(node.anchor.x * -node.size.width, 
            node.anchor.y * -node.size.height, node.size.width, 
            node.size.height);
    };
    ko.Graphics2D.prototype.drawSprite = function (sprite) {
        this.context.globalAlpha = sprite.opacity;
        this.context.drawImage(sprite.image, sprite.anchor.x * 
            -sprite.size.width, sprite.anchor.y * -sprite.size.height);
    };
    ko.Graphics2D.prototype.drawLabel = function (label) {
        this.context.fillStyle = label.color;
        this.context.font = label.font;
        this.context.globalAlpha = label.opacity;
        this.context.fillText(label.text, label.anchor.x * 
            -label.size.width, label.anchor.y * -label.size.height);
    };
    ko.Graphics2D.prototype.getLabelSize = function (label) {
        this.context.font = label.font;
        var textMetrics = this.context.measureText(label.text);
        return { width: textMetrics.width, height: 0 };
    };
    ko.graphics = new ko.Graphics2D();
    return ko;
})(ko || {});

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

var ko = (function (ko) {
    ko.Sprite = function (image, args) {
        ko.Node.call(this, args);
        /*global Image*/
        if (image instanceof Image) {
            this.image = image;
        } else {
            this.image = new Image();
            this.image.src = image;
        }
        var self = this;
        this.image.addEventListener('load', function () {
            self.size = { 
                width: self.image.width, 
                height: self.image.height 
            };
        });
        this._draw = function () {
            ko.graphics.drawSprite(this);
        };
    };
    ko.Sprite.prototype = Object.create(ko.Node.prototype);
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Label = function (text, font, args) {
        ko.Node.call(this, args);
        this.setText(text);
        this.setFont(font);
        this._draw = function () {
            ko.graphics.drawLabel(this);
        };
    };
    ko.Label.prototype = Object.create(ko.Node.prototype);
    ko.Label.prototype.setText = function (text) {
        this.text = text;
        this.size = ko.graphics.getLabelSize(this);
    };
    ko.Label.prototype.setFont = function (font) {
        this.font = font;
        this.size = ko.graphics.getLabelSize(this);
    };
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.BoundingBox = function (node) {
        this.node = node;
    };
    ko.BoundingBox.prototype.isIntersecting = function(bbox, separate) {
        var a = {
            x: this.node.position.x,
            y: this.node.position.y,
            w: this.node.size.width,
            h: this.node.size.height
        };
        a.l = a.x - a.w * this.node.anchor.x;
        a.r = a.x + a.w * (1 - this.node.anchor.x);
        a.t = a.y - a.h * this.node.anchor.y;
        a.b = a.y + a.h * (1 - this.node.anchor.y);
        var b = {
            x: bbox.node.position.x,
            y: bbox.node.position.y,
            w: bbox.node.size.width,
            h: bbox.node.size.height
        };
        b.l = b.x - b.w * bbox.node.anchor.x;
        b.r = b.x + b.w * (1 - bbox.node.anchor.x);
        b.t = b.y - b.h * bbox.node.anchor.y;
        b.b = b.y + b.h * (1 - bbox.node.anchor.y);
        if (a.r <= b.l || a.l >= b.r || a.b <= b.t || a.t >= b.b) {
            return false;
        }
        if (!separate) {
            return true;
        }
        var diffx = Math.min(Math.abs(a.r - b.l), Math.abs(b.r - a.l));
        var diffy = Math.min(Math.abs(a.b - b.t), Math.abs(b.b - a.t));
        if (diffx < diffy) {
            if (a.l < b.l) {
                this.node.position.x = b.l - a.w * (1 - this.node.anchor.x);
            } else {
                this.node.position.x = b.r + a.w * this.node.anchor.x;
            }
        } else {
            if (a.t < b.t) {
                this.node.position.y = b.t - a.h * (1 - this.node.anchor.y);
            } else {
                this.node.position.y = b.b + a.h * this.node.anchor.y;
            }
        }
        return true;
    };
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Action = function (duration, actionEase) {
        this.duration = duration;
        this.actionEase = actionEase;
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
        if (this.actionEase) {
            this.value = this.actionEase(this.elapsed / this.duration);
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

    ko.MoveTo = function (x, y, duration, actionEase) {
        ko.Action.call(this, duration, actionEase);
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

    ko.ScaleTo = function (scaleTo, duration, actionEase) {
        ko.Action.call(this, duration, actionEase);
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

    ko.RotateTo = function (rotateTo, duration, actionEase) {
        ko.Action.call(this, duration, actionEase);
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

    ko.FadeTo = function (fadeTo, duration, actionEase) {
        ko.Action.call(this, duration, actionEase);
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
        if (!this.func) {
            return;
        }
        this.func(this.args);
    };

    // Ease functions based on code from http://www.cocos2d-iphone.org/
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

var ko = (function (ko) {
    ko.Sequence = function (actions, repeatCount) {
        this.actions = actions || [];
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

var ko = (function (ko) {
    var Director = function () {
    };
    Director.prototype.update = function (delta) {
        if (!this.scene) {
            return;
        }
        this.scene.handleInput();
        this.scene.update(delta);
    };
    Director.prototype.draw = function () {
        if (!this.scene) {
            return;
        }
        this.scene.draw();
    };
    Director.prototype.fadeTo = function(scene, duration, color) {
        color = color || 'rgb(0,0,0)';
        var transition = new ko.Transition(scene, duration, function () {
            transition.fromScene.color = color;
            transition.fromScene.fadeTo(1, duration / 2, ko.actionEase.sineInOut);
            transition.toScene.visible = false;
        }, function () {
            transition.fromScene.visible = false;
            transition.toScene.position = { x: 0, y: 0 };
            transition.toScene.color = color;
            transition.toScene.opacity = 1;
            transition.toScene.fadeTo(0, duration / 2, ko.actionEase.sineInOut);
            transition.toScene.visible = true;
        });
        this.scene = transition;
    };
    Director.prototype.slideTo = function(scene, x, y, duration, actionEase) {
        actionEase = actionEase || ko.actionEase.sineInOut;
        var transition = new ko.Transition(scene, duration, function () {
            transition.fromScene.visible = true;
            transition.fromScene.moveTo(x, y, duration, actionEase);
            transition.toScene.visible = true;
            transition.toScene.position = { x: -x, y: -y };
            transition.toScene.opacity = 0;
            transition.toScene.moveTo(0, 0, duration, actionEase);
        });
        this.scene = transition;
    };
    ko.director = new Director();
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Scene = function (args) {
        ko.Node.call(this, args);
        this.centerAnchor();
        this.color = 'rgb(0,0,0)';
        this.opacity = 0;
    };
    ko.Scene.prototype = Object.create(ko.Node.prototype);
    ko.Scene.prototype.draw = function () {
		if (!this.visible) {
			return;
		}
		ko.Node.prototype.draw.call(this);
		ko.graphics.clear(this.color, this.opacity);
    };
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Transition = 
        function (scene, duration, transitionOut, transitionIn, wait) {
        if (!scene) {
            throw new Error("'scene' have not been specified when creating " +
                "transition");
        }
        if (!ko.director.scene) {
            throw new Error("'ko.director.scene' can not be empty when " +
                "creating transition");
        }
        ko.Scene.call(this);
        this.fromScene = ko.director.scene;
        this.toScene = scene;
        // The duration is meant to be specified as the total duration for the 
        // transition. The duration is split up among transition-in/out.
        duration = duration / 2;
        var self = this;
        var transitionComplete = new ko.Call(function () {
            ko.director.scene = self.toScene;
        });
        this.sequence(1).
            call(transitionOut).
            wait(duration).
            wait(wait).
            call(transitionIn).
            wait(duration).
            action(transitionComplete).
            init(this);
        this._draw = function () {
            if (this.fromScene) {
                this.fromScene.draw();
            }
            if (this.toScene) {
                this.toScene.draw();
            }
        };
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
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Popup = function (scene, duration, transitionOut, transitionIn) {
        if (!scene) {
            throw new Error("'scene' have not been specified when " + 
                "creating popup");
        }
        if (!ko.director.scene) {
            throw new Error("'ko.director.scene' can not be empty when " +
                "creating popup");
        }
        ko.Scene.call(this);
        this.fromScene = ko.director.scene;
        this.toScene = scene;
        this.duration = duration;
        this.transitionOut = transitionOut;
        this.sequence(1).
            call(transitionIn).
            wait(duration).
            init(this);
        this._draw = function () {
            this.fromScene.draw();
            this.toScene.draw();
        };
    };
    ko.Popup.prototype = Object.create(ko.Scene.prototype);
    ko.Popup.prototype.update = function (delta) {
        ko.Scene.prototype.update.call(this, delta);
        this.fromScene.update(delta);
        this.toScene.update(delta);
    };
    ko.Popup.prototype.handleInput = function () {
        ko.Scene.prototype.handleInput.call(this);
        this.toScene.handleInput();
    };
    ko.Popup.prototype.close = function () {
        var self = this;
        var transitionComplete = new ko.Call(function () {
            ko.director.scene = self.fromScene;
        });
        this.sequence(1).
            call(self.transitionOut).
            wait(this.duration).
            action(transitionComplete).
            init(this);
    };
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Menu = function (fontSize, fontName, items) {
        ko.Node.call(this);
        this.itemColor = 'rgb(255,255,255)';
        this.selectedItemColor = 'rgb(255,215,0)';
        this.selectedItemIndex = 0;
        this.spacing = 10;
        this.fontSize = fontSize;
        this.font = fontSize + "px " + fontName;
        this._items = items;
        this.createLabels();
        this.alignItemsCenter();
    };
    ko.Menu.prototype = Object.create(ko.Node.prototype);
    ko.Menu.prototype.update = function (delta) {
        ko.Node.prototype.update.call(this, delta);
        for (var i = 0; i < this._labels.length; i++) {
            this._labels[i].color = i === this.selectedItemIndex ? 
                this.selectedItemColor : this.itemColor;
        }
    };
    ko.Menu.prototype.handleInput = function () {
        if (ko.keyboard.wasKeyHeld(ko.keyboard.UP)) {
            this.prevItem();
        } 
        else if (ko.keyboard.wasKeyHeld(ko.keyboard.DOWN)) {
            this.nextItem();
        }
        if (ko.keyboard.wasKeyPressed(ko.keyboard.ENTER)) {
            this.selectItem();
        }
    };
    ko.Menu.prototype.createLabels = function () {
        this._labels = [];
        for (var i = 0; i < this._items.length; i++) {
            var label = new ko.Label(this._items[i], this.font);
            this._labels.push(label);
            this.addChild(label);
        }
    };
    ko.Menu.prototype.alignItemsCenter = function () {
        var self = this;
        var _calcPosition = function (i) {
            var c = self._labels.length - 1;
            var s = self.spacing;
            var f = self.fontSize;
            return -(c * f + c * s) / 2 + (f + s) * i;
        };
        for (var i = 0; i < this._items.length; i++) {
            this._labels[i].position = { x: 0, y: _calcPosition(i) };
            this._labels[i].anchor = { x: 0.5, y: 0.5 };
        }
        this.position = { 
            x: ko.graphics.size.width / 2, 
            y: ko.graphics.size.height / 2
        };
    };
    ko.Menu.prototype.nextItem = function () {
        if (this.selectedItemIndex < this._items.length - 1) {
            this.selectedItemIndex++;
        }
    };
    ko.Menu.prototype.prevItem = function () {
        if (this.selectedItemIndex > 0) {
            this.selectedItemIndex--;
        }
    };
    ko.Menu.prototype.selectItem = function () {
        if (!this.itemSelected) {
            return;
        }
        this.itemSelected();
    };
    return ko;
})(ko || {});

var ko = (function (ko) {
    /*global Audio*/
    ko.Audio = function () {
        this.sounds = [];
    };
    ko.Audio.prototype.playSound = function(url, volume, id) {
        var sound = new Audio(url);
        sound.id = id;
        sound.volume = volume || 1;
        sound.play();
        this.sounds.push(sound);
    };
    ko.Audio.prototype.playMusic = function(url, volume) {
        this.music = new Audio(url);
        this.music.volume = volume || 1;
        this.music.play();
    };
    ko.Audio.prototype.stopSound = function(id) {
        if (id === undefined) {
            throw new Error("Must specify 'id' when stopping a sound.");
        }
        for (var i = 0; i < this.sounds.length; i++) {
            if (this.sounds[i].id === id) {
                this.sounds[i].pause();
                this.sounds.splice(i, 1);
                break;
            }
        }
    };
    ko.Audio.prototype.stopMusic = function() {
        if (!this.music) {
            throw new Error("Can't stop music before music has been played.");
        }
        this.music.pause();
    };
    ko.Audio.prototype.stopAllSounds = function() {
        for (var i = this.sounds.length - 1; i >= 0; i--) {
            this.sounds[i].pause();
            this.sounds.splice(i, 1);
        }
    };
    ko.Audio.prototype.fadeMusic = function(volume, duration) {
        if (!this.music) {
            throw new Error("Can't fade music before music has been played.");
        }
        this.fadeFrom = this.music.volume;
        this.fadeTo = volume;
        this.fadeAction = new ko.Action(duration || 1);
        this.fadeAction.init(this);
    };
    ko.Audio.prototype.isMusicPlaying = function() {
        if (!this.music) {
            return false;
        }
        return !this.music.paused;
    };
    ko.Audio.prototype.update = function(delta) {
        if (!this.fadeAction) {
            return;
        }
        this.fadeAction.update(delta);
        this.music.volume = this.fadeFrom + ((this.fadeTo - this.fadeFrom) * 
            this.fadeAction.value);
        if (this.fadeAction.isComplete()) {
            delete this.fadeAction;
        }
    };
    ko.audio = new ko.Audio();
    return ko;
})(ko || {});
