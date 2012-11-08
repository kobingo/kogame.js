/*global ko, Image, start, test, asyncTest, throws, ok, equal, deepEqual, expect*/

var createNodeAndPerformAction = function (action) {
	var node = new ko.Node();
	node.perform(action);
	return node;
};

var assertGameIsInitialized = function () {
	if (!ko.game.initialized) {
		ko.game.init('game');
	}
};

/* Game */

test("game - run (should throw exception)", function () {
	throws(
        function() {
            ko.game.run();
        },
        /Game has not been initialized/
    );
});

test("game - init (should throw exception)", function () {
	throws(
        function() {
            ko.game.init();
        },
        /Couldn't find canvas 'undefined'/
    );
});

test("game - init", function () {
	ko.game.init('game');
	ok(ko.game.initialized);
});

/* Node */

test("node - create", function () {
	var node = new ko.Node();
	equal(node.rotation, 0);
	equal(node.scale, 1);
	equal(node.opacity, 1);
	ok(node.visible);
	equal(node.color, 'rgb(255,255,255)');
});

test("node - update", function () {
	var node = new ko.Node();
	node.acceleration = { x: 1, y: 1 };
	node.update(1);
	deepEqual(node.velocity, { x: 1, y: 1 });
	deepEqual(node.position, { x: 1, y: 1 });
	node.update(1);
	deepEqual(node.velocity, { x: 2, y: 2 });
	deepEqual(node.position, { x: 3, y: 3 });
});

test("node - update children", function () {
	var node1 = new ko.Node();
	var node2 = new ko.Node();
	node1.addChild(node2);
	node2.acceleration = { x: 1, y: 1 };
	node1.update(1);
	deepEqual(node2.velocity, { x: 1, y: 1 });
	deepEqual(node2.position, { x: 1, y: 1 });
	node1.update(1);
	deepEqual(node2.velocity, { x: 2, y: 2 });
	deepEqual(node2.position, { x: 3, y: 3 });
});

test("node - add child (should throw exception) 1", function () {
	throws(
        function() {
            var node = new ko.Node();
			node.addChild(node);
        },
        /Can't add a child to itself/
    );
});

test("node - add child (should throw exception) 2", function () {
	throws(
        function() {
            var node1 = new ko.Node();
            var node2 = new ko.Node();
			node1.addChild(node2);
			node1.addChild(node2);
        },
        /Child already has a parent/
    );
});

test("node - move to", function () {
	var node = new ko.Node();
    node.moveTo(50, 25, 3);
    node.update(3);
    deepEqual(node.position, {x:50, y:25});
});

test("node - scale to", function () {
	var node = new ko.Node();
    node.scaleTo(2, 2);
    node.update(3);
    equal(node.scale, 2);
});

test("node - rotate to", function () {
	var node = new ko.Node();
    node.rotateTo(Math.PI, 1);
    node.update(1);
    equal(node.rotation, Math.PI);
});

test("node - fade to", function () {
	var node = new ko.Node();
    node.fadeTo(0, 1);
    node.update(1);
    equal(node.opacity, 0);
});

test("node - sequence", function () {
	var node = new ko.Node();
	node.sequence().scaleTo(2, 1).rotateTo(1, 1).init(node);
	node.update(1);
	equal(node.scale, 2);
	node.update(1);
	equal(node.rotation, 1);
});

/* Sprite */

test("sprite - create (with image)", function () {
	var image = new Image();
	image.src = 'img/gem.png';
	var sprite = new ko.Sprite(image);
	ok(sprite.image.src.indexOf('img/gem.png'));
	ok(sprite instanceof ko.Node);
});

test("sprite - create (with url)", function () {
	var sprite = new ko.Sprite('img/gem.png');
	ok(sprite.image.src.indexOf('img/gem.png'));
});

asyncTest("sprite - size", 2, function() {
	var sprite = new ko.Sprite('img/gem.png');
    sprite.image.addEventListener('load', function () {
        ok(sprite.size.width > 0);
        ok(sprite.size.height > 0);
        start();
    });
});

/* Label */

test("label - create", function () {
	assertGameIsInitialized();
	var label = new ko.Label("Kogame.js", "32px arial");
	ok(label.size.width > 0);
	ok(label instanceof ko.Node);
});

/* Action */

test("action - is complete", function () {
	var action = new ko.Action(1);
	action.init(new ko.Node());
	action.update(0.5);
	ok(!action.isComplete());
	action.update(0.5);
	ok(action.isComplete());
});

test("action - update (should throw exception)", function () {
	throws(
        function() {
            var action = new ko.Action(1);
			action.update(1);
        },
        /Action has not been initialized with a target/
    );
});

/* MoveTo */

test("move to - create", function () {
	var moveTo = new ko.MoveTo({ x:0, y:0 }, 1);
	ok(moveTo instanceof ko.Action);
});

test("move to - update (duration is zero)", function () {
	var pos = { x:100, y:50 };
	var moveTo = new ko.MoveTo(pos.x, pos.y, 0);
	var node = createNodeAndPerformAction(moveTo);
	node.update(0);
	deepEqual(node.position, pos);
});

test("move to - update (delta 1.0)", function () {
	var pos = { x:100, y:50 };
	var moveTo = new ko.MoveTo(pos.x, pos.y, 1);
	var node = createNodeAndPerformAction(moveTo);
	node.update(1);
	deepEqual(node.position, pos);
});

test("move to - update (delta 0.5)", function () {
	var pos = { x:100, y:50 };
	var moveTo = new ko.MoveTo(pos.x, pos.y, 1);
	var node = createNodeAndPerformAction(moveTo);
	node.update(0.5);
	deepEqual(node.position, { x:pos.x/2, y:pos.y/2 });
});

test("move to - update (delta 2.0)", function () {
	var pos = { x:100, y:50 };
	var moveTo = new ko.MoveTo(pos.x, pos.y, 1);
	var node = createNodeAndPerformAction(moveTo);
	node.update(2);
	deepEqual(node.position, pos);
});

/* ScaleTo */

test("scale to - create", function () {
	var scaleTo = new ko.ScaleTo(2, 1);
	ok(scaleTo instanceof ko.Action);
});

test("scale to - update (delta 1.0)", function () {
	var scale = 1.5;
	var scaleTo = new ko.ScaleTo(scale, 1);
	var node = createNodeAndPerformAction(scaleTo);
	node.update(1);
	equal(node.scale, scale);
});

test("scale to - update (delta 0.5)", function () {
	var scale = 1.5;
	var scaleTo = new ko.ScaleTo(scale, 1);
	var node = createNodeAndPerformAction(scaleTo);
	node.update(0.5);
	equal(node.scale, 1.25);
});

test("scale to - update (delta 2.0)", function () {
	var scale = 0.5;
	var scaleTo = new ko.ScaleTo(scale, 1);
	var node = createNodeAndPerformAction(scaleTo);
	node.update(2);
	equal(node.scale, scale);
});

/* RotateTo */

test("rotate to - create", function () {
	var rotateTo = new ko.RotateTo(Math.PI, 1);
	ok(rotateTo instanceof ko.Action);
});

test("rotate to - update (delta 1.0)", function () {
	var rotate = Math.PI * 2;
	var rotateTo = new ko.RotateTo(rotate, 1);
	var node = createNodeAndPerformAction(rotateTo);
	node.update(1);
	equal(node.rotation, rotate);
});

test("rotate to - update (delta 0.5)", function () {
	var rotate = Math.PI;
	var rotateTo = new ko.RotateTo(rotate, 1);
	var node = createNodeAndPerformAction(rotateTo);
	node.update(0.5);
	equal(node.rotation, rotate * 0.5);
});

test("rotate to - update (delta 2.0)", function () {
	var rotate = Math.PI * 3;
	var rotateTo = new ko.RotateTo(rotate, 1);
	var node = createNodeAndPerformAction(rotateTo);
	node.update(2);
	equal(node.rotation, rotate);
});

/* FadeTo */

test("fade to - create", function () {
	var fadeTo = new ko.FadeTo(0, 1);
	ok(fadeTo instanceof ko.Action);
});

test("fade to - update (delta 1.0)", function () {
	var opacity = 0;
	var fadeTo = new ko.FadeTo(opacity, 1);
	var node = createNodeAndPerformAction(fadeTo);
	node.update(1);
	equal(node.opacity, opacity);
});

test("fade to - update (delta 0.5)", function () {
	var opacity = 0.5;
	var fadeTo = new ko.FadeTo(opacity, 1);
	var node = createNodeAndPerformAction(fadeTo);
	node.update(0.5);
	equal(node.opacity, 0.75);
});

test("fade to - update (delta 2.0)", function () {
	var opacity = 0;
	var fadeTo = new ko.FadeTo(opacity, 1);
	var node = createNodeAndPerformAction(fadeTo);
	node.update(2);
	equal(node.opacity, opacity);
});

/* Sequence */

test("sequence - create", function () {
	var sequence = new ko.Sequence([], 1);
	ok(sequence instanceof ko.Action);
});

test("sequence - update (3 actions)", function () {
	var sequence = new ko.Sequence([
		new ko.FadeTo(0, 1), 
		new ko.ScaleTo(1.5, 1), 
		new ko.RotateTo(Math.PI * 2, 1)
	], 1);
	var node = createNodeAndPerformAction(sequence);
	for (var i = 0; i < 3; i++) {
		node.update(1);
	}
	equal(node.opacity, 0);
	equal(node.scale, 1.5);
	equal(node.rotation, Math.PI * 2);
});

test("sequence - update (3 actions, 1 with zero duration)", function () {
	var sequence = new ko.Sequence([
		new ko.MoveTo(25, 25, 1),
		new ko.MoveTo(100, 100, 0),
		new ko.MoveTo(55, 55, 1)
	], 1);
	var node = createNodeAndPerformAction(sequence);
	node.update(1);
	deepEqual(node.position, { x:100, y:100 });
	node.update(1);
	deepEqual(node.position, { x:55, y:55 });
});

test("sequence - update (2 actions, 1 with zero duration)", function () {
	var sequence = new ko.Sequence([
		new ko.FadeTo(0, 1),
		new ko.FadeTo(1, 0)
	], 1);
	var node = createNodeAndPerformAction(sequence);
	node.update(1);
	equal(node.opacity, 1);
});

test("sequence - is complete", function () {
	var sequence = new ko.Sequence([
		new ko.RotateTo(Math.PI, 1)
	], 2);
	var node = createNodeAndPerformAction(sequence);
	node.update(1);
	ok(!sequence.isComplete());
	node.update(1);
	ok(sequence.isComplete());
});

/* Director */

test("director - update scene", function () {
	var updated = false;
	var scene = new ko.Scene(function (delta) {
		updated = true;
	});
	ko.director.scene = scene;
	ko.director.update(1);
	ok(updated);
});

/* Scene */

test("scene - create", function () {
	var scene = new ko.Scene();
	ok(scene instanceof ko.Node);
});

