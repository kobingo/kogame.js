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
        var transition = new ko.Transition({
            fromScene: this.scene, 
            outDuration: duration, 
            inDuration: duration, 
            ease: ko.actionEase.sineInOut,
            transitionOut: function (d) {
                transition.fromScene.color = color;
                transition.fromScene.fadeTo(1, duration, 
                    ko.actionEase.sineInOut);
            },
            transitionIn: function (d) {
                transition.fromScene = null;
                transition.toScene = scene;
                transition.toScene.position = { x: 0, y: 0};
                transition.toScene.color = color;
                transition.toScene.opacity = 1;
                transition.toScene.fadeTo(0, duration, 
                    ko.actionEase.sineInOut);
            }
        });
        this.scene = transition;
    };
    Director.prototype.slideTo = function(scene, x, y, duration, ease) {
        var _fromScene = this.scene;
        var _toScene = scene;
        var transition = new ko.Transition({
            fromScene: _fromScene, 
            toScene: _toScene, 
            inDuration: duration, 
            ease: ko.actionEase.sineInOut,
            transitionIn: function (d) {
                _fromScene.moveTo(x, y, duration, ease);
                _toScene.position = { x: -x, y: -y };
                _toScene.opacity = 0;
                _toScene.moveTo(0, 0, duration, ease);
            }
        });
        this.scene = transition;
    };
    ko.director = new Director();
    return ko;
})(ko || {});
