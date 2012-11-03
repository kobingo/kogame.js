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
