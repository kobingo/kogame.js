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
