var ko = (function (ko) {
    ko.BoundingBox = function (node) {
        this.node = node;
    };
    ko.BoundingBox.prototype.isIntersecting = function(bbox, separate) {
        var a = {
            x: this.node.position.x,
            y: this.node.position.y,
            w: this.node.size.width,
            h: this.node.size.height
        };
        a.l = a.x - a.w * this.node.anchor.x;
        a.r = a.x + a.w * (1 - this.node.anchor.x);
        a.t = a.y - a.h * this.node.anchor.y;
        a.b = a.y + a.h * (1 - this.node.anchor.y);
        var b = {
            x: bbox.node.position.x,
            y: bbox.node.position.y,
            w: bbox.node.size.width,
            h: bbox.node.size.height
        };
        b.l = b.x - b.w * bbox.node.anchor.x;
        b.r = b.x + b.w * (1 - bbox.node.anchor.x);
        b.t = b.y - b.h * bbox.node.anchor.y;
        b.b = b.y + b.h * (1 - bbox.node.anchor.y);
        if (a.r <= b.l || a.l >= b.r || a.b <= b.t || a.t >= b.b) {
            return false;
        }
        if (!separate) {
            return true;
        }
        var diffx = Math.min(Math.abs(a.r - b.l), Math.abs(b.r - a.l));
        var diffy = Math.min(Math.abs(a.b - b.t), Math.abs(b.b - a.t));
        if (diffx < diffy) {
            if (a.l < b.l) {
                this.node.position.x = b.l - a.w * (1 - this.node.anchor.x);
            } else {
                this.node.position.x = b.r + a.w * this.node.anchor.x;
            }
        } else {
            if (a.t < b.t) {
                this.node.position.y = b.t - a.h * (1 - this.node.anchor.y);
            } else {
                this.node.position.y = b.b + a.h * this.node.anchor.y;
            }
        }
        return true;
    };
    return ko;
})(ko || {});
