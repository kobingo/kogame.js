var ko = (function (ko) {
    ko.Sprite = function (image, update) {
        ko.Node.call(this, update);
        this.image = image;
        this.anchor = { x: 0.5, y: 0.5 };
        var self = this;
        image.addEventListener('load', function () {
            self.size = { 
                width: self.image.width, 
                height: self.image.height 
            };
        });
        this._render = function () {
            ko.renderer.drawSprite(this);
        };
    };
    ko.Sprite.prototype = Object.create(ko.Node.prototype);
    return ko;
})(ko || {});
