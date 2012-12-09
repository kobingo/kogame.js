var ko = (function (ko) {
    ko.Animation = function (images, fps) {
        if (!images || images.length === 0) {
            throw new Error("'images' can not be empty when creating " + 
                "animation.");
        }
        this.frames = [];
        this.frameIndex = 0;
        for (var i = 0; i < images.length; i++) {
            /*global Image*/
            if (images[i] instanceof Image) {
                this.frames.push(images[i]);
            } else {
                var frame = new Image();
                frame.src = images[i];
                this.frames.push(frame);
            }
        }
        var self = this;
        this.sequence = new ko.Sequence();
        this.sequence.
            wait(1 / (fps || 30)).
            call(function () {
                self.frameIndex = (self.frameIndex + 1) % self.frames.length;
            });
    };
    ko.Animation.prototype.update = function (delta) {
        this.sequence.update(delta);
    };
    ko.Animation.prototype.init = function () {
        this.sequence.init();
    };
    ko.Animation.prototype.getFrameImage = function () {
        return this.frames[this.frameIndex];
    };
    return ko;
})(ko || {});
