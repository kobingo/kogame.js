var ko = (function (ko) {
    ko.Label = function (text, font, args) {
        ko.Node.call(this, args);
        this.setText(text);
        this.setFont(font);
        this._draw = function () {
            ko.graphics.drawLabel(this);
        };
    };
    ko.Label.prototype = Object.create(ko.Node.prototype);
    ko.Label.prototype.setText = function (text) {
        this.text = text;
        this.size = ko.graphics.getLabelSize(this);
    };
    ko.Label.prototype.setFont = function (font) {
        this.font = font;
        this.size = ko.graphics.getLabelSize(this);
    };
    return ko;
})(ko || {});
