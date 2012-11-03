var ko = (function (ko) {
    ko.Scene = function (update) {
        ko.Node.call(this, update);
        this.anchor = { x: 0.5, y: 0.5 };
    };
    ko.Scene.prototype = Object.create(ko.Node.prototype);
    return ko;
})(ko || {});
