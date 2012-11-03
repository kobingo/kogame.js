var canvas = document.getElementById('game');

ko.game.init(canvas);

var image = new Image();

var sprite = new ko.Sprite(image);
sprite.position = { x: -150, y: canvas.height / 2 };
sprite.scale = 0.5;

var action = new ko.MoveTo({ x: canvas.width / 2, y: canvas.height / 2 }, 5);
sprite.perform(action);

var scene = new ko.Scene();
scene.addChild(sprite);

image.onload = function () {
    ko.game.run(scene);
};
image.src = 'img/gem.png';