var ko = (function (ko) {
    ko.Menu = function (fontSize, fontName, items) {
        ko.Node.call(this);
        this.itemColor = 'rgb(255,255,255)';
        this.selectedItemColor = 'rgb(255,215,0)';
        this.selectedItemIndex = 0;
        this.spacing = 10;
        this.fontSize = fontSize;
        this.font = fontSize + "px " + fontName;
        this._items = items;
        this.createLabels();
        this.alignItemsCenter();
    };
    ko.Menu.prototype = Object.create(ko.Node.prototype);
    ko.Menu.prototype.update = function (delta) {
        ko.Node.prototype.update.call(this, delta);
        for (var i = 0; i < this._labels.length; i++) {
            this._labels[i].color = i === this.selectedItemIndex ? 
                this.selectedItemColor : this.itemColor;
        }
    };
    ko.Menu.prototype.handleInput = function () {
        if (ko.keyboard.wasKeyHeld(ko.keyboard.UP)) {
            this.prevItem();
        } 
        else if (ko.keyboard.wasKeyHeld(ko.keyboard.DOWN)) {
            this.nextItem();
        }
        if (ko.keyboard.wasKeyPressed(ko.keyboard.ENTER)) {
            this.selectItem();
        }
    };
    ko.Menu.prototype.createLabels = function () {
        this._labels = [];
        for (var i = 0; i < this._items.length; i++) {
            var label = new ko.Label(this._items[i], this.font);
            this._labels.push(label);
            this.addChild(label);
        }
    };
    ko.Menu.prototype.alignItemsCenter = function () {
        var self = this;
        var _calcPosition = function (i) {
            var c = self._labels.length - 1;
            var s = self.spacing;
            var f = self.fontSize;
            return -(c * f + c * s) / 2 + (f + s) * i;
        };
        for (var i = 0; i < this._items.length; i++) {
            this._labels[i].position = { x: 0, y: _calcPosition(i) };
            this._labels[i].anchor = { x: 0.5, y: 0.5 };
        }
        this.position = { 
            x: ko.renderer.size.width / 2, 
            y: ko.renderer.size.height / 2
        };
    };
    ko.Menu.prototype.nextItem = function () {
        if (this.selectedItemIndex < this._items.length - 1) {
            this.selectedItemIndex++;
        }
    };
    ko.Menu.prototype.prevItem = function () {
        if (this.selectedItemIndex > 0) {
            this.selectedItemIndex--;
        }
    };
    ko.Menu.prototype.selectItem = function () {
        if (!this.itemSelected) {
            return;
        }
        this.itemSelected();
    };
    return ko;
})(ko || {});
