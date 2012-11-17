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
            outDuration: duration / 2, 
            inDuration: duration / 2, 
            ease: ko.actionEase.sineInOut,
            transitionIn: function (d) {
                transition.fromScene = null;
                transition.toScene = scene;
                transition.toScene.position = { x: 0, y: 0};
            }
        });
        transition.render = function () {
            ko.Transition.prototype.render.call(this);
            ko.renderer.clear(color, this.state === ko.transitionState.IN ? 
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
            outDuration: duration, 
            ease: ko.actionEase.sineInOut,
            transitionOut: function (d) {
                _fromScene.moveTo(x, y, duration, ease);
                _toScene.position = { x: -x, y: -y };
                _toScene.moveTo(0, 0, duration, ease);
            },
            transitionIn: function (d) {
            }
        });
        this.scene = transition;
    };
    ko.director = new Director();
    return ko;
})(ko || {});
