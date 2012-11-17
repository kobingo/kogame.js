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
    Director.prototype.render = function () {
        if (!this.scene) {
            return;
        }
        this.scene.render();
    };
    Director.prototype.fadeTo = function(scene, duration, color) {
        var transition = new ko.Transition({
            fromScene: this.scene, 
            toScene: scene, 
            duration1: duration / 2, 
            duration2: duration / 2, 
            ease: ko.actionEase.sineInOut
        });
        transition.render = function () {
            ko.Transition.prototype.render.call(this);
            ko.renderer.clear(color, this.state === ko.transitionState.TRANSITION2 ? 
                1 - transition.transitionValue : transition.transitionValue);
        };
        this.scene = transition;
    };
    Director.prototype.slideTo = function(scene, x, y, duration, ease) {
        var _fromScene = this.scene;
        var _toScene = scene;
        var transition = new ko.Transition({
            fromScene: _fromScene, 
            toScene: _toScene, 
            duration1: duration, 
            ease: ko.actionEase.sineInOut,
            transition1: function (d) {
                _fromScene.moveTo(x, y, duration, ease);
                _toScene.position = { x: -x, y: -y };
                _toScene.moveTo(0, 0, duration, ease);
            },
            transition2: function (d) {
            }
        });
        this.scene = transition;
    };
    ko.director = new Director();
    return ko;
})(ko || {});
