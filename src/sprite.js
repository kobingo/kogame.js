var ko = (function (ko) {
    ko.Sprite = function (image, update) {
        ko.Node.call(this, update);
        /*global Image*/
        if (image instanceof Image) {
            this.image = image;
        } else {
            this.image = new Image();
            this.image.src = image;
        }
        this.anchor = { x: 0.5, y: 0.5 };
        var self = this;
        this.image.addEventListener('load', function () {
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
