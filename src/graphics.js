var ko = (function (ko) {
    ko.Graphics2D = function (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.clearColor = 'rgb(100, 149, 237)';
        this.size = { width: canvas.width, height: canvas.height };
        this.center = { x: canvas.width / 2, y: canvas.height / 2};
    };
    ko.Graphics2D.prototype.clear = function (color, opacity) {
        if (opacity === undefined) {
            opacity = 1;
        }
        this.context.globalAlpha = opacity;
        this.context.fillStyle = color || this.clearColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    ko.Graphics2D.prototype.beginTransform = function (node) {
        this.context.save();
        this.context.translate(node.position.x, node.position.y);
        this.context.scale(node.scale, node.scale);
        this.context.rotate(node.rotation);
    };
    ko.Graphics2D.prototype.endTransform = function () {
        this.context.restore();
    };
    ko.Graphics2D.prototype.drawRect = function (node) {
        this.context.globalAlpha = node.opacity;
        this.context.fillStyle = node.color;
        this.context.fillRect(node.anchor.x * -node.size.width, 
            node.anchor.y * -node.size.height, node.size.width, 
            node.size.height);
    };
    ko.Graphics2D.prototype.drawSprite = function (sprite) {
        this.context.globalAlpha = sprite.opacity;
        this.context.drawImage(sprite.image, sprite.anchor.x * 
            -sprite.size.width, sprite.anchor.y * -sprite.size.height);
    };
    ko.Graphics2D.prototype.drawLabel = function (label) {
        this.context.fillStyle = label.color;
        this.context.font = label.font;
        this.context.globalAlpha = label.opacity;
        this.context.fillText(label.text, label.anchor.x * 
            -label.size.width, label.anchor.y * -label.size.height);
    };
    ko.Graphics2D.prototype.getLabelSize = function (label) {
        this.context.font = label.font;
        var textMetrics = this.context.measureText(label.text);
        return { width: textMetrics.width, height: 0 };
    };
    return ko;
})(ko || {});
