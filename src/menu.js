var ko = (function (ko) {
    ko.Menu = function (fontSize, fontName, items) {
        if (!items) {
            throw new Error("Can't create menu without any items.");
        }
        ko.Node.call(this);
        this.itemColor = 'rgb(255,255,255)';
        this.selectedItemColor = 'rgb(255,215,0)';
        this.selectedItemIndex = 0;
        this.spacing = 10;
        this.fontSize = fontSize;
        this.font = fontSize + "px " + fontName;
        this.items = items;
        this.createLabels();
        this.alignItemsCenter();
    };
    ko.Menu.prototype = Object.create(ko.Node.prototype);
    ko.Menu.prototype.update = function (delta) {
        ko.Node.prototype.update.call(this, delta);
        for (var i = 0; i < this.labels.length; i++) {
            this.labels[i].color = i === this.selectedItemIndex ? 
                this.selectedItemColor : this.itemColor;
        }
    };
    ko.Menu.prototype.handleInput = function () {
        if (ko.keyboard.wasKeyHeld(ko.keyboard.UP)) {
            this.selectPreviousItem();
        }
        if (ko.keyboard.wasKeyHeld(ko.keyboard.DOWN)) {
            this.selectNextItem();
        }
        if (ko.keyboard.wasKeyPressed(ko.keyboard.ENTER)) {
            this.chooseSelectedItem();
        }
    };
    ko.Menu.prototype.createLabels = function () {
        this.labels = [];
        for (var i = 0; i < this.items.length; i++) {
            var label = new ko.Label(this.items[i], this.font);
            this.labels.push(label);
            this.addChild(label);
        }
    };
    ko.Menu.prototype.alignItemsCenter = function () {
        var self = this;
        var calculatePosition = function (i) {
            var c = self.labels.length - 1;
            var s = self.spacing;
            var f = self.fontSize;
            return -(c * f + c * s) / 2 + (f + s) * i;
        };
        for (var i = 0; i < this.items.length; i++) {
            this.labels[i].position.y = calculatePosition(i);
            this.labels[i].centerAnchor();
        }
        this.setPosition(ko.graphics.center);
    };
    ko.Menu.prototype.selectNextItem = function () {
        if (this.selectedItemIndex < this.items.length - 1) {
            this.selectedItemIndex++;
            this.selectedItemChanged();
        }
    };
    ko.Menu.prototype.selectPreviousItem = function () {
        if (this.selectedItemIndex > 0) {
            this.selectedItemIndex--;
            this.selectedItemChanged();
        }
    };
    ko.Menu.prototype.selectedItemChanged = function () {
        for (var i = 0; i < this.items.length; i++) {
            if (i === this.selectedItemIndex) {
                continue;
            }
            this.labels[i].scaleTo(1, 0.1, ko.actionEase.sineInOut);
        }
        this.labels[this.selectedItemIndex].scaleTo(1.1, 0.1, 
            ko.actionEase.sineInOut);
    };
    ko.Menu.prototype.chooseSelectedItem = function () {
        if (!this.onSelectedItemChosen) {
            return;
        }
        this.onSelectedItemChosen();
    };
    return ko;
})(ko || {});
