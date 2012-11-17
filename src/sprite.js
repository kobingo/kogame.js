var ko = (function (ko) {
    ko.Sprite = function (image, args) {
        ko.Node.call(this, args);
        /*global Image*/
        if (image instanceof Image) {
            this.image = image;
        } else {
            this.image = new Image();
            this.image.src = image;
        }
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
