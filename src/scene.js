var ko = (function (ko) {
    ko.Scene = function (args) {
        ko.Node.call(this, args);
        this.centerAnchor();
    };
    ko.Scene.prototype = Object.create(ko.Node.prototype);
    return ko;
})(ko || {});
