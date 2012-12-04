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
        var trans = this.transitionTo(scene, duration, function () {
            trans.fromScene.color = color;
            trans.fromScene.fadeTo(1, duration/2, ko.actionEase.sineInOut);
            trans.toScene.visible = false;
        }, function () {
            trans.fromScene.visible = false;
            trans.toScene.position = { x: 0, y: 0 };
            trans.toScene.color = color;
            trans.toScene.opacity = 1;
            trans.toScene.fadeTo(0, duration/2, ko.actionEase.sineInOut);
            trans.toScene.visible = true;
        });
    };
    Director.prototype.slideTo = function(scene, x, y, duration, actionEase) {
        actionEase = actionEase || ko.actionEase.sineInOut;
        var trans = this.transitionTo(scene, duration, function () {
            trans.fromScene.visible = true;
            trans.fromScene.moveTo(x, y, duration, actionEase);
            trans.toScene.visible = true;
            trans.toScene.position = { x: -x, y: -y };
            trans.toScene.opacity = 0;
            trans.toScene.moveTo(0, 0, duration, actionEase);
        });
    };
    ko.director = new Director();
    return ko;
})(ko || {});
