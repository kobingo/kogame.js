var ko = (function (ko) {
    ko.Graphics2D = function () {
    };
    ko.Graphics2D.prototype.init = function (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.center = { x: canvas.width / 2, y: canvas.height / 2};
    };
    ko.Graphics2D.prototype.clear = function (color, opacity) {
        if (opacity === undefined) {
            opacity = 1;
        }
        this.context.globalAlpha = opacity;
        this.context.fillStyle = color || 'rgb(100, 149, 237)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    ko.Graphics2D.prototype.beginTransform = function (node) {
        this.context.save();
        this.context.translate(node.position.x, node.position.y);
        this.context.scale(node.scale, node.scale);
        this.context.rotate(node.rotation);
        this.context.translate(-node.camera.x, -node.camera.y);
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
        this.context.textAlign = label.align;
        this.context.textBaseline = label.baseline;
        this.context.globalAlpha = label.opacity;
        this.context.fillText(label.text, 0, 0);
    };
    ko.graphics = new ko.Graphics2D();
    return ko;
})(ko || {});
