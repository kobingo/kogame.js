/*! Kogame.js - v0.6.0 - 2012-12-16
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
    var canvas;
    var Game = function () {
        this.targetDelta = 1000 / 60;
    };
    Game.prototype.init = function (canvasId) {
        /*global document*/
        canvas = document.getElementById(canvasId);
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
    Game.prototype.toggleFullscreen = function () {
        if (!canvas) {
            return;
        }
        var requestFullScreen = 
            canvas.requestFullScreen ||
            canvas.webkitRequestFullScreen ||
            canvas.mozRequestFullScreen ||
            canvas.oRequestFullScreen ||
            canvas.msRequestFullScreen;
        var isFullScreen = 
            document.isFullScreen ||
            document.webkitIsFullScreen ||
            document.mozIsFullScreen ||
            document.oIsFullScreen ||
            document.msIsFullScreen;
        var cancelFullScreen = 
            document.cancelFullScreen ||
            document.webkitCancelFullScreen ||
            document.mozCancelFullScreen ||
            document.oCancelFullScreen ||
            document.msCancelFullScreen;
        if (!isFullScreen && requestFullScreen) {
            requestFullScreen.call(canvas);
        } else if (cancelFullScreen){
            cancelFullScreen.call(document);
        }
    };
    Game.prototype.autoCenterAndScaleToFit = function () {
        window.addEventListener("resize", function () {
            _autoCenterAndScaleToFit();
        }); 
        var _autoCenterAndScaleToFit = function () {
            if (!canvas) {
                return;
            }
            var ratio = Math.min(window.innerWidth / canvas.width, 
                window.innerHeight / canvas.height);
            canvas.style.width = canvas.width * ratio + "px";
            canvas.style.height = canvas.height * ratio + "px";
            canvas.style.position = "absolute";
            canvas.style.left = (window.innerWidth - 
                canvas.width * ratio) / 2 + "px";
            canvas.style.top = (window.innerHeight - 
                canvas.height * ratio) / 2 + "px";
        };
        _autoCenterAndScaleToFit();
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
        this.width = canvas.width;
        this.height = canvas.height;
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
        this.context.translate(-node.camera.x, -node.camera.y);
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
        this.context.textAlign = label.align;
        this.context.textBaseline = label.baseline;
        this.context.globalAlpha = label.opacity;
        this.context.fillText(label.text, 0, 0);
    };
    ko.graphics = new ko.Graphics2D();
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Node = function () {
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.color = 'rgb(255,255,255)';
        this.opacity = 1;
        this.rotation = 0;
        this.scale = 1;
        this.anchor = { x: 0, y: 0 };
        this.size = { width: 0, height: 0 };
        this.camera = { x: 0, y: 0 };
        this.visible = true;
        this.active = true;
        this.children = [];
        this.actions = [];
        this.onUpdate = function (delta) {};
        this.onHandleInput = function () {};
        this.onDraw = function () {};
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
    };
    ko.Node.prototype.moveBy = function (x, y, duration, actionEase) {
        this.performAction(new ko.MoveBy(x, y, duration, actionEase));
    };
    ko.Node.prototype.scaleTo = function (scaleTo, duration, actionEase) {
        this.performAction(new ko.ScaleTo(scaleTo, duration, actionEase));
    };
    ko.Node.prototype.scaleBy = function (scaleBy, duration, actionEase) {
        this.performAction(new ko.ScaleBy(scaleBy, duration, actionEase));
    };
    ko.Node.prototype.rotateTo = function (rotateTo, duration, actionEase) {
        this.performAction(new ko.RotateTo(rotateTo, duration, actionEase));
    };
    ko.Node.prototype.rotateBy = function (rotateBy, duration, actionEase) {
        this.performAction(new ko.RotateBy(rotateBy, duration, actionEase));
    };
    ko.Node.prototype.fadeTo = function (fadeTo, duration, actionEase) {
        this.performAction(new ko.FadeTo(fadeTo, duration, actionEase));
    };
    ko.Node.prototype.fadeBy = function (fadeBy, duration, actionEase) {
        this.performAction(new ko.FadeBy(fadeBy, duration, actionEase));
    };
    ko.Node.prototype.performSequence = function (repeat) {
        var sequence = new ko.Sequence([], repeat);
        this.performAction(sequence);
        return sequence;
    };
    ko.Node.prototype.setPosition = function (position) {
        this.position = { x: position.x, y: position.y };
    };
    ko.Node.prototype.setCamera = function (position) {
        this.camera = { x: position.x, y: position.y };
    };
    ko.Node.prototype.centerAnchor = function () {
        this.anchor = { x: 0.5, y: 0.5 };
    };
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Sprite = function (image) {
        ko.Node.call(this);
        if (image) {
            this.setImage(image);
        }
        this.onDraw = function () {
            if (!this.image) {
                return;
            }
            ko.graphics.drawSprite(this);
        };
    };
    ko.Sprite.prototype = Object.create(ko.Node.prototype);
    ko.Sprite.prototype.update = function (delta) {
        ko.Node.prototype.update.call(this, delta);
        if (this.animation) {
            this.animation.update(delta);
            this.image = this.animation.getFrameImage();
        }
    };
    ko.Sprite.prototype.setImage = function (image) {
        if (!image) {
            throw new Error("'image' can not be empty when setting image on " +
                "sprite.");
        }
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
    };
    ko.Sprite.prototype.playAnimation = function (animation) {
        this.animation = animation;
        this.animation.init();
    };
    ko.Sprite.prototype.stopAnimation = function () {
        this.animation = null;
    };
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Animation = function (images, fps) {
        if (!images || images.length === 0) {
            throw new Error("'images' can not be empty when creating " + 
                "animation.");
        }
        this.frames = [];
        this.frameIndex = 0;
        for (var i = 0; i < images.length; i++) {
            /*global Image*/
            if (images[i] instanceof Image) {
                this.frames.push(images[i]);
            } else {
                var frame = new Image();
                frame.src = images[i];
                this.frames.push(frame);
            }
        }
        var self = this;
        this.sequence = new ko.Sequence();
        this.sequence.
            wait(1 / (fps || 30)).
            call(function () {
                self.frameIndex = (self.frameIndex + 1) % self.frames.length;
            });
    };
    ko.Animation.prototype.update = function (delta) {
        this.sequence.update(delta);
    };
    ko.Animation.prototype.init = function () {
        this.sequence.init();
    };
    ko.Animation.prototype.getFrameImage = function () {
        return this.frames[this.frameIndex];
    };
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Label = function (text, font, args) {
        ko.Node.call(this, args);
        this.text = text;
        this.font = font;
        this.baseline = 'top';
        this.align = 'left';
        this.onDraw = function () {
            ko.graphics.drawLabel(this);
        };
    };
    ko.Label.prototype = Object.create(ko.Node.prototype);
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.boundingBox = {
        isIntersecting: function(node1, node2, separate) {
            if (node1.parent !== node2.parent) {
                throw new Error("Both nodes must have the same parent when " + 
                    "testing bounding box intersection.");
            }
            var a = {
                x: node1.position.x,
                y: node1.position.y,
                w: node1.size.width,
                h: node1.size.height
            };
            a.l = a.x - a.w * node1.anchor.x;
            a.r = a.x + a.w * (1 - node1.anchor.x);
            a.t = a.y - a.h * node1.anchor.y;
            a.b = a.y + a.h * (1 - node1.anchor.y);
            var b = {
                x: node2.position.x,
                y: node2.position.y,
                w: node2.size.width,
                h: node2.size.height
            };
            b.l = b.x - b.w * node2.anchor.x;
            b.r = b.x + b.w * (1 - node2.anchor.x);
            b.t = b.y - b.h * node2.anchor.y;
            b.b = b.y + b.h * (1 - node2.anchor.y);
            if (a.r <= b.l || a.l >= b.r || a.b <= b.t || a.t >= b.b) {
                return ko.boundingBox.intersection.NONE;
            }
            var intersection = ko.boundingBox.intersection.NONE;
            var position = { x: node1.position.x, y: node1.position.y };
            var diffx = Math.min(Math.abs(a.r - b.l), Math.abs(b.r - a.l));
            var diffy = Math.min(Math.abs(a.b - b.t), Math.abs(b.b - a.t));
            if (diffx < diffy) {
                if (a.l < b.l) {
                    position.x = b.l - a.w * (1 - node1.anchor.x);
                    intersection = ko.boundingBox.intersection.RIGHT;
                } else {
                    position.x = b.r + a.w * node1.anchor.x;
                    intersection = ko.boundingBox.intersection.LEFT;
                }
            } else {
                if (a.t < b.t) {
                    position.y = b.t - a.h * (1 - node1.anchor.y);
                    intersection = ko.boundingBox.intersection.BOTTOM;
                } else {
                    position.y = b.b + a.h * node1.anchor.y;
                    intersection = ko.boundingBox.intersection.TOP;
                }
            }
            if (separate) {
                node1.setPosition(position);
            }
            return intersection;
        },
        intersection: {
            NONE: 0,
            LEFT: 1,
            RIGHT: 2,
            TOP: 3,
            BOTTOM: 4
        }
    };
    ko.boundingSphere = {
        isIntersecting: function (node1, node2) {
            if (node1.parent !== node2.parent) {
                throw new Error("Both nodes must have the same parent when " + 
                    "testing bounding sphere intersection.");
            }
            if (!node1.radius || !node2.radius) {
                throw new Error("Both nodes must have a radius when testing " + 
                    "for bounding sphere intersection.");
            }
            var x = node1.position.x - node2.position.x;
            var y = node1.position.y - node2.position.y;
            var distance = Math.sqrt(x * x + y * y);
            if(distance <= (node1.radius + node2.radius))
            {
                return true;
            }
            return false;
        }
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
    ko.MoveBy = function (x, y, duration, actionEase) {
        ko.Action.call(this, duration, actionEase);
        this.moveBy = { x: x, y: y };
    };
    ko.MoveBy.prototype = Object.create(ko.Action.prototype);
    ko.MoveBy.prototype.init = function (target) {
        ko.Action.prototype.init.call(this, target);
        this.moveFrom = { 
            x: target.position.x, 
            y: target.position.y 
        };
    };
    ko.MoveBy.prototype.perform = function () {
        this.target.position.x = this.moveFrom.x + this.moveBy.x * this.value;
        this.target.position.y = this.moveFrom.y + this.moveBy.y * this.value;
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
    ko.ScaleBy = function (scaleBy, duration, actionEase) {
        ko.Action.call(this, duration, actionEase);
        this.scaleBy = scaleBy;
    };
    ko.ScaleBy.prototype = Object.create(ko.Action.prototype);
    ko.ScaleBy.prototype.init = function (target) {
        ko.Action.prototype.init.call(this, target);
        this.scaleFrom = target.scale;
    };
    ko.ScaleBy.prototype.perform = function () {
        this.target.scale = this.scaleFrom + this.scaleBy * this.value;
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
    ko.RotateBy = function (rotateBy, duration, actionEase) {
        ko.Action.call(this, duration, actionEase);
        this.rotateBy = rotateBy;
    };
    ko.RotateBy.prototype = Object.create(ko.Action.prototype);
    ko.RotateBy.prototype.init = function (target) {
        ko.Action.prototype.init.call(this, target);
        this.rotateFrom = target.rotation;
    };
    ko.RotateBy.prototype.perform = function () {
        this.target.rotation = this.rotateFrom + this.rotateBy * this.value;
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
    ko.FadeBy = function (fadeBy, duration, actionEase) {
        ko.Action.call(this, duration, actionEase);
        this.fadeBy = fadeBy;
    };
    ko.FadeBy.prototype = Object.create(ko.Action.prototype);
    ko.FadeBy.prototype.init = function (target) {
        ko.Action.prototype.init.call(this, target);
        this.fadeFrom = target.opacity;
    };
    ko.FadeBy.prototype.perform = function () {
        this.target.opacity = this.fadeFrom + this.fadeBy * this.value;
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
        ko.Action.prototype.init.call(this, target);
        this.actionIndex = 0;
        this.repeatIndex = 0;
    };
    ko.Sequence.prototype.update = function (delta) {
        if (this.actions.length === 0) {
            return;
        }
        if (this.repeatIndex >= this.repeatCount) {
            return;
        }
        var currentAction = this.actions[this.actionIndex];
        if (!currentAction.target && this.target) {
            currentAction.init(this.target);
        }
        currentAction.update(delta);
        while (currentAction.isComplete()) {
            this.nextAction();
            // When we have repeated enough times we want to return immediatly
            if (this.repeatIndex >= this.repeatCount) {
                return;
            }
            currentAction = this.actions[this.actionIndex];
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
    ko.Sequence.prototype.moveBy = function (x, y, duration, ease) {
        this.actions.push(new ko.MoveBy(x, y, duration, ease));
        return this;
    };
    ko.Sequence.prototype.scaleTo = function (scaleTo, duration, ease) {
        this.actions.push(new ko.ScaleTo(scaleTo, duration, ease));
        return this;
    };
    ko.Sequence.prototype.scaleBy = function (scaleBy, duration, ease) {
        this.actions.push(new ko.ScaleBy(scaleBy, duration, ease));
        return this;
    };
    ko.Sequence.prototype.rotateTo = function (rotateTo, duration, ease) {
        this.actions.push(new ko.RotateTo(rotateTo, duration, ease));
        return this;
    };
    ko.Sequence.prototype.rotateBy = function (rotateBy, duration, ease) {
        this.actions.push(new ko.RotateBy(rotateBy, duration, ease));
        return this;
    };
    ko.Sequence.prototype.fadeTo = function (fadeTo, duration, ease) {
        this.actions.push(new ko.FadeTo(fadeTo, duration, ease));
        return this;
    };
    ko.Sequence.prototype.fadeBy = function (fadeBy, duration, ease) {
        this.actions.push(new ko.FadeBy(fadeBy, duration, ease));
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
    Director.prototype.transitionTo = function(scene, duration, transitionOut, 
        transitionIn, wait) {
        var trans = new ko.Transition(this.scene, scene, duration, 
            transitionOut, transitionIn, wait);
        this.scene = trans;
        return trans;
    };
    Director.prototype.popupTo = function(scene, duration, transitionOut, 
        transitionIn) {
        var popup = new ko.Popup(this.scene, scene, duration, 
            transitionOut, transitionIn);
        this.scene = popup;
        return popup;
    };
    Director.prototype.fadeTo = function(scene, duration, color) {
        color = color || 'rgb(0,0,0)';
        var fadeOut = function () {
            transition.fromScene.color = color;
            transition.fromScene.fadeTo(1, duration/2, ko.actionEase.sineInOut);
            transition.toScene.visible = false;
        };
        var fadeIn = function () {
            transition.fromScene.visible = false;
            transition.toScene.position = { x: 0, y: 0 };
            transition.toScene.color = color;
            transition.toScene.opacity = 1;
            transition.toScene.fadeTo(0, duration/2, ko.actionEase.sineInOut);
            transition.toScene.visible = true;
        };
        var transition = this.transitionTo(scene, duration, fadeOut, fadeIn);
    };
    Director.prototype.slideTo = function(scene, x, y, duration, actionEase) {
        actionEase = actionEase || ko.actionEase.sineInOut;
        var slide = function () {
            transition.fromScene.visible = true;
            transition.fromScene.moveTo(x, y, duration, actionEase);
            transition.toScene.visible = true;
            transition.toScene.position = { x: -x, y: -y };
            transition.toScene.opacity = 0;
            transition.toScene.moveTo(0, 0, duration, actionEase);
        };
        var transition = this.transitionTo(scene, duration, slide);
    };
    ko.director = new Director();
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Scene = function () {
        ko.Node.call(this);
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
        function (fromScene, toScene, duration, transitionOut, transitionIn, wait) {
        if (!fromScene) {
            throw new Error("'fromScene' have not been specified when creating " +
                "transition");
        }
        if (!toScene) {
            throw new Error("'toScene' have not been specified when creating " +
                "transition");
        }
        ko.Scene.call(this);
        this.fromScene = fromScene;
        this.toScene = toScene;
        // The duration is meant to be specified as the total duration for the 
        // transition. The duration is split up among transition-in/out.
        duration = duration / 2;
        var self = this;
        var transitionComplete = new ko.Call(function () {
            ko.director.scene = self.toScene;
        });
        this.performSequence(1).
            call(transitionOut).
            wait(duration).
            wait(wait).
            call(transitionIn).
            wait(duration).
            action(transitionComplete);
        this.onDraw = function () {
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
    ko.Popup = function (fromScene, toScene, duration, transitionOut, 
        transitionIn) {
        if (!fromScene) {
            throw new Error("'fromScene' have not been specified when " + 
                "creating popup");
        }
        if (!toScene) {
            throw new Error("'toScene' have not been specified when " + 
                "creating popup");
        }
        ko.Scene.call(this);
        this.fromScene = fromScene;
        this.toScene = toScene;
        this.duration = duration;
        this.transitionOut = transitionOut;
        this.performSequence(1).
            call(transitionIn).
            wait(duration);
        this.onDraw = function () {
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
        this.performSequence(1).
            call(self.transitionOut).
            wait(this.duration).
            action(transitionComplete);
    };
    return ko;
})(ko || {});

var ko = (function (ko) {
    ko.Menu = function (fontSize, fontName, items) {
        if (!items) {
            throw new Error("Can't create menu without any items.");
        }
        ko.Node.call(this);
        this.itemColor = 'rgb(50,50,50)';
        this.selectedItemColor = 'rgb(255,255,255)';
        this.selectedItemIndex = 0;
        this.spacing = 10;
        this.fontSize = fontSize;
        this.font = fontSize + "px " + fontName;
        this.items = items;
        this.createLabels();
        this.alignItemsCenter();
    };
    ko.Menu.prototype = Object.create(ko.Node.prototype);
    ko.Menu.prototype.update = function (delta) {
        ko.Node.prototype.update.call(this, delta);
        for (var i = 0; i < this.labels.length; i++) {
            this.labels[i].color = i === this.selectedItemIndex ? 
                this.selectedItemColor : this.itemColor;
        }
    };
    ko.Menu.prototype.handleInput = function () {
        if (ko.keyboard.wasKeyHeld(ko.keyboard.UP)) {
            this.selectPreviousItem();
        }
        if (ko.keyboard.wasKeyHeld(ko.keyboard.DOWN)) {
            this.selectNextItem();
        }
        if (ko.keyboard.wasKeyPressed(ko.keyboard.ENTER)) {
            this.chooseSelectedItem();
        }
    };
    ko.Menu.prototype.createLabels = function () {
        this.labels = [];
        for (var i = 0; i < this.items.length; i++) {
            var label = new ko.Label(this.items[i], this.font);
            label.align = 'center';
            label.baseline = 'middle';
            this.labels.push(label);
            this.addChild(label);
        }
    };
    ko.Menu.prototype.alignItemsCenter = function () {
        var self = this;
        var calculatePosition = function (i) {
            var c = self.labels.length - 1;
            var s = self.spacing;
            var f = self.fontSize;
            return -(c * f + c * s) / 2 + (f + s) * i;
        };
        for (var i = 0; i < this.items.length; i++) {
            this.labels[i].position.y = calculatePosition(i);
        }
        this.setPosition(ko.graphics.center);
    };
    ko.Menu.prototype.selectNextItem = function () {
        if (this.selectedItemIndex < this.items.length - 1) {
            this.selectedItemIndex++;
            this.selectedItemChanged();
        }
    };
    ko.Menu.prototype.selectPreviousItem = function () {
        if (this.selectedItemIndex > 0) {
            this.selectedItemIndex--;
            this.selectedItemChanged();
        }
    };
    ko.Menu.prototype.selectedItemChanged = function () {
        if (!this.onSelectedItemChanged) {
            return;
        }
        this.onSelectedItemChanged();
    };
    ko.Menu.prototype.chooseSelectedItem = function () {
        if (!this.onSelectedItemChosen) {
            return;
        }
        this.onSelectedItemChosen();
    };
    return ko;
})(ko || {});

var ko = (function (ko) {
    /*global Audio*/
    ko.Audio = function () {
        this.sounds = [];
    };
    ko.Audio.prototype.playSound = function(url, loop, id, volume) {
        var sound = new Audio(url);
        sound.id = id;
        sound.volume = volume || 1;
        sound.loop = loop;
        sound.play();
        this.sounds.push(sound);
    };
    ko.Audio.prototype.playMusic = function(url, loop, volume) {
        this.music = new Audio(url);
        this.music.volume = volume || 1;
        this.music.loop = loop;
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
