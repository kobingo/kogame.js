var ko = (function (ko) {
    ko.Scene = function (args) {
        ko.Node.call(this, args);
        this.centerAnchor();
        this.opacity = 0;
    };
    ko.Scene.prototype = Object.create(ko.Node.prototype);
    ko.Scene.prototype.draw = function () {
		ko.Node.prototype.draw.call(this);
		ko.graphics.clear(this.color, this.opacity);
    };
    return ko;
})(ko || {});
