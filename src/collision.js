var ko = (function (ko) {
    ko.boundingBox = {
        isIntersecting: function(node1, node2, separate) {
            if (node1.parent !== node2.parent) {
                throw new Error("Both nodes must have the same parent when " + 
                    "testing bounding box intersection.");
            }
            var a = {
                x: node1.position.x,
                y: node1.position.y,
                w: node1.size.width,
                h: node1.size.height
            };
            a.l = a.x - a.w * node1.anchor.x;
            a.r = a.x + a.w * (1 - node1.anchor.x);
            a.t = a.y - a.h * node1.anchor.y;
            a.b = a.y + a.h * (1 - node1.anchor.y);
            var b = {
                x: node2.position.x,
                y: node2.position.y,
                w: node2.size.width,
                h: node2.size.height
            };
            b.l = b.x - b.w * node2.anchor.x;
            b.r = b.x + b.w * (1 - node2.anchor.x);
            b.t = b.y - b.h * node2.anchor.y;
            b.b = b.y + b.h * (1 - node2.anchor.y);
            if (a.r <= b.l || a.l >= b.r || a.b <= b.t || a.t >= b.b) {
                return ko.boundingBox.intersection.NONE;
            }
            var intersection = ko.boundingBox.intersection.NONE;
            var position = { x: node1.position.x, y: node1.position.y };
            var diffx = Math.min(Math.abs(a.r - b.l), Math.abs(b.r - a.l));
            var diffy = Math.min(Math.abs(a.b - b.t), Math.abs(b.b - a.t));
            if (diffx < diffy) {
                if (a.l < b.l) {
                    position.x = b.l - a.w * (1 - node1.anchor.x);
                    intersection = ko.boundingBox.intersection.RIGHT;
                } else {
                    position.x = b.r + a.w * node1.anchor.x;
                    intersection = ko.boundingBox.intersection.LEFT;
                }
            } else {
                if (a.t < b.t) {
                    position.y = b.t - a.h * (1 - node1.anchor.y);
                    intersection = ko.boundingBox.intersection.BOTTOM;
                } else {
                    position.y = b.b + a.h * node1.anchor.y;
                    intersection = ko.boundingBox.intersection.TOP;
                }
            }
            if (separate) {
                node1.setPosition(position);
            }
            return intersection;
        },
        intersection: {
            NONE: 0,
            LEFT: 1,
            RIGHT: 2,
            TOP: 3,
            BOTTOM: 4
        }
    };
    ko.boundingSphere = {
        isIntersecting: function (node1, node2) {
            if (node1.parent !== node2.parent) {
                throw new Error("Both nodes must have the same parent when " + 
                    "testing bounding sphere intersection.");
            }
            if (!node1.radius || !node2.radius) {
                throw new Error("Both nodes must have a radius when testing " + 
                    "for bounding sphere intersection.");
            }
            var x = node1.position.x - node2.position.x;
            var y = node1.position.y - node2.position.y;
            var distance = Math.sqrt(x * x + y * y);
            if(distance <= (node1.radius + node2.radius))
            {
                return true;
            }
            return false;
        }
    };
    return ko;
})(ko || {});
