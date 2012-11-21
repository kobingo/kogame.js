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
        var transition = new ko.Transition(scene, duration, function () {
            transition.fromScene.color = color;
            transition.fromScene.fadeTo(1, duration, ko.actionEase.sineInOut);
            transition.toScene.visible = false;
        }, function () {
            transition.fromScene.visible = false;
            transition.toScene.position = { x: 0, y: 0 };
            transition.toScene.color = color;
            transition.toScene.opacity = 1;
            transition.toScene.fadeTo(0, duration, ko.actionEase.sineInOut);
            transition.toScene.visible = true;
        });
        this.scene = transition;
    };
    Director.prototype.slideTo = function(scene, x, y, duration, actionEase) {
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
