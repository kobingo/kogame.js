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
