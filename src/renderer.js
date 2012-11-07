var ko = (function (ko) {
    ko.Renderer = function (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.clearColor = 'rgb(100, 149, 237)';
        this.size = { width: canvas.width, height: canvas.height };
        this.center = { x: canvas.width / 2, y: canvas.height / 2};
    };
    ko.Renderer.prototype.clear = function () {
        this.context.globalAlpha = 1;
        this.context.fillStyle = this.clearColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    ko.Renderer.prototype.beginTransform = function (node) {
        this.context.save();
        this.context.translate(node.position.x, node.position.y);
        this.context.scale(node.scale, node.scale);
        this.context.rotate(node.rotation);
    };
    ko.Renderer.prototype.endTransform = function () {
        this.context.restore();
    };
    ko.Renderer.prototype.drawRect = function (color, opacity) {
        this.context.globalAlpha = opacity;
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    ko.Renderer.prototype.drawSprite = function (sprite) {
        this.context.globalAlpha = sprite.opacity;
        this.context.drawImage(sprite.image, sprite.anchor.x * 
            -sprite.size.width, sprite.anchor.y * -sprite.size.height);
    };
    ko.Renderer.prototype.drawLabel = function (label) {
        this.context.fillStyle = label.color;
        this.context.font = label.font;
        this.context.globalAlpha = label.opacity;
        this.context.fillText(label.text, label.anchor.x * 
            -label.size.width, label.anchor.y * -label.size.height);
    };
    ko.Renderer.prototype.getLabelSize = function (label) {
        this.context.font = label.font;
        var textMetrics = this.context.measureText(label.text);
        return { width: textMetrics.width, height: 0 };
    };
    return ko;
})(ko || {});
