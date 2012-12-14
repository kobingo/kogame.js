var ko = (function (ko) {
    ko.Sprite = function (image) {
        ko.Node.call(this);
        if (image) {
            this.setImage(image);
        }
        this.onDraw = function () {
            if (!this.image) {
                return;
            }
            ko.graphics.drawSprite(this);
        };
    };
    ko.Sprite.prototype = Object.create(ko.Node.prototype);
    ko.Sprite.prototype.update = function (delta) {
        ko.Node.prototype.update.call(this, delta);
        if (this.animation) {
            this.animation.update(delta);
            this.image = this.animation.getFrameImage();
        }
    };
    ko.Sprite.prototype.setImage = function (image) {
        if (!image) {
            throw new Error("'image' can not be empty when setting image on " +
                "sprite.");
        }
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
    };
    ko.Sprite.prototype.playAnimation = function (animation) {
        this.animation = animation;
        this.animation.init();
    };
    ko.Sprite.prototype.stopAnimation = function () {
        this.animation = null;
    };
    return ko;
})(ko || {});
