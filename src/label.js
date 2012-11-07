var ko = (function (ko) {
    ko.Label = function (text, font) {
        ko.Node.call(this);
        this.setText(text);
        this.setFont(font);
        this._render = function () {
            ko.renderer.drawLabel(this);
        };
    };
    ko.Label.prototype = Object.create(ko.Node.prototype);
    ko.Label.prototype.setText = function (text) {
        this.text = text;
        this.size = ko.renderer.getLabelSize(this);
    };
    ko.Label.prototype.setFont = function (font) {
        this.font = font;
        this.size = ko.renderer.getLabelSize(this);
    };
    return ko;
})(ko || {});
