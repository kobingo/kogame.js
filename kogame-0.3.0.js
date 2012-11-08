/*! Kogame.js - v0.3.0 - 2012-11-08
* https://github.com/kobingo/kogame.js
* Copyright (c) 2012 Jens Andersson; Licensed MIT */

var ko = (function (ko) {
    /*global window*/
    var _animationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    var _animate = function () {
        ko.game.update(0.016);
        _animationFrame(_animate);
    };
    var Game = function () {
    };
    Game.prototype.init = function (canvasId) {
        /*global document*/
        var canvas = document.getElementById(canvasId);
        if (!canvas) {
            throw new Error("Couldn't find canvas '" + canvasId + "'");
        }
        ko.renderer = new ko.Renderer(canvas);
        this.initialized = true;
    };
    Game.prototype.run = function (scene) {
        if (!this.initialized) {
            throw new Error("Game has not been initialized");
        }
        ko.director.scene = scene;
        _animationFrame(_animate);
    };
    Game.prototype.update = function (delta) {
        ko.director.update(delta);
        ko.renderer.clear();
        ko.director.render();
        ko.keyboard.update();
        ko.mouse.update();
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
    var isButtonDown;
    var wasButtonPressed;
    var Mouse = function () {
        var self = this;
        this.position = { x: 0, y: 0 };
        this.moved = { x: 0, y: 0 };
        /*global window*/
        window.addEventListener('mousemove', function (event) {
            if (self.position.x !== 0) {
                self.moved.x = event.offsetX - self.position.x;
            }
            if (self.position.y !== 0) {
                self.moved.y = event.offsetY - self.position.y;
            }
            self.position.x = event.offsetX;
            self.position.y = event.offsetY;
        }, false);
        window.addEventListener('mousedown', function (event) {
            if (!isButtonDown) {
                wasButtonPressed = true;
            }
            isButtonDown = true;
        }, false);
        window.addEventListener('mouseup', function (event) {
            isButtonDown = false;
        }, false);
    };
    Mouse.prototype.update = function () {
        this.moved.x = 0;
        this.moved.y = 0;
        wasButtonPressed = false;
    };
    Mouse.prototype.isButtonDown = function () {
        return isButtonDown;
    };
    Mouse.prototype.wasButtonPressed = function () {
        return wasButtonPressed;
    };
    ko.mouse = new Mouse();
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Renderer = function (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.clearColor = 'rgb(100, 149, 237)';
        this.size = { width: canvas.width, height: canvas.height };
        this.center = { x: canvas.width / 2, y: canvas.height / 2};
    };
    ko.Renderer.prototype.clear = function () {
        this.context.globalAlpha = 1;
        this.context.fillStyle = this.clearColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    ko.Renderer.prototype.beginTransform = function (node) {
        this.context.save();
        this.context.translate(node.position.x, node.position.y);
        this.context.scale(node.scale, node.scale);
        this.context.rotate(node.rotation);
    };
    ko.Renderer.prototype.endTransform = function () {
        this.context.restore();
    };
    ko.Renderer.prototype.drawRect = function (color, opacity) {
        this.context.globalAlpha = opacity;
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    ko.Renderer.prototype.drawSprite = function (sprite) {
        this.context.globalAlpha = sprite.opacity;
        this.context.drawImage(sprite.image, sprite.anchor.x * 
            -sprite.size.width, sprite.anchor.y * -sprite.size.height);
    };
    ko.Renderer.prototype.drawLabel = function (label) {
        this.context.fillStyle = label.color;
        this.context.font = label.font;
        this.context.globalAlpha = label.opacity;
        this.context.fillText(label.text, label.anchor.x * 
            -label.size.width, label.anchor.y * -label.size.height);
    };
    ko.Renderer.prototype.getLabelSize = function (label) {
        this.context.font = label.font;
        var textMetrics = this.context.measureText(label.text);
        return { width: textMetrics.width, height: 0 };
    };
    return ko;
})(ko || {});

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
    ko.Node.prototype.perform = function (action) {
        if (action.target) {
            throw new Error("Action is already in use.");
        }
        action.init(this);
        this._actions.push(action);
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
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Sprite = function (image, update) {
        ko.Node.call(this, update);
        /*global Image*/
        if (image instanceof Image) {
            this.image = image;
        } else {
            this.image = new Image();
            this.image.src = image;
        }
        this.anchor = { x: 0.5, y: 0.5 };
        var self = this;
        this.image.addEventListener('load', function () {
            self.size = { 
                width: self.image.width, 
                height: self.image.height 
            };
        });
        this._render = function () {
            ko.renderer.drawSprite(this);
        };
    };
    ko.Sprite.prototype = Object.create(ko.Node.prototype);
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Label = function (text, font) {
        ko.Node.call(this);
        this.setText(text);
        this.setFont(font);
        this._render = function () {
            ko.renderer.drawLabel(this);
        };
    };
    ko.Label.prototype = Object.create(ko.Node.prototype);
    ko.Label.prototype.setText = function (text) {
        this.text = text;
        this.size = ko.renderer.getLabelSize(this);
    };
    ko.Label.prototype.setFont = function (font) {
        this.font = font;
        this.size = ko.renderer.getLabelSize(this);
    };
    return ko;
})(ko || {});

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

    ko.actionEase = {
        sineInOut: function (t) {
            return -0.5 * (Math.cos(Math.PI * t) - 1);
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
        }
    };

    return ko;
})(ko || {});

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

var ko = (function (ko) {
    var Director = function () {
        this.fadeTransition = new FadeTransition();
    };
    Director.prototype.update = function (delta) {
        if (!this.scene) {
            return;
        }
        this.scene.update(delta);
        this.fadeTransition.update(delta);
    };
    Director.prototype.render = function () {
        if (!this.scene) {
            return;
        }
        this.scene.render();
        this.fadeTransition.render();
    };
    Director.prototype.fadeTo = function(scene, duration, color) {
        this.fadeTransition.fadeTo(scene, duration, color);
    };
    var FadeTransition = function () {
        this.value = 0;
        this.update = function (delta) {
            if (!this.fadeToAction) {
                return;
            }
            var isFadingOut = this.fadeToScene ? true : false;
            this.fadeToAction.update(delta);
            if (isFadingOut) {
                this.value = this.fadeToAction.value;
                if (this.fadeToAction.isComplete()  ) {
                    ko.director.scene = this.fadeToScene;
                    this.fadeToAction.init();
                    delete this.fadeToScene;
                }
            } else {
                this.value = 1 - this.fadeToAction.value;
                if (this.fadeToAction.isComplete()) {
                    delete this.fadeToAction;
                }
            }
        };
        this.render = function (delta) {
            if (this.value > 0) {
                ko.renderer.drawRect(this.color, this.value);
            }
        };
        this.fadeTo = function (scene, duration, color) {
            if (this.fadeToAction) {
                return;
            }
            this.fadeToScene = scene;
            this.duration = duration || 1;
            this.color = color || 'rgb(0,0,0)';
            this.fadeToAction = new ko.Action(
                this.duration / 2, ko.actionEase.sineInOut);
        };
    };
    ko.director = new Director();
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Scene = function (update) {
        ko.Node.call(this, update);
        this.anchor = { x: 0.5, y: 0.5 };
    };
    ko.Scene.prototype = Object.create(ko.Node.prototype);
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
        this.handleInput();
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
            x: ko.renderer.size.width / 2, 
            y: ko.renderer.size.height / 2
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
