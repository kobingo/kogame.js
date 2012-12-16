var ko = (function (ko) {
    ko.Label = function (text, font, args) {
        ko.Node.call(this, args);
        this.text = text;
        this.font = font;
        this.baseline = 'top';
        this.align = 'left';
        this.onDraw = function () {
            ko.graphics.drawLabel(this);
        };
    };
    ko.Label.prototype = Object.create(ko.Node.prototype);
    return ko;
})(ko || {});
