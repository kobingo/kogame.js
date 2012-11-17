/*global ko, Image, start, test, asyncTest, throws, ok, equal, deepEqual, strictEqual, expect*/

var createNodeAndPerformAction = function (action) {
	var node = new ko.Node();
	node.perform(action);
	return node;
};

var createNode = function(x, y, width, height) {
	var node = new ko.Node();
	node.position = { x: x, y: y };
	node.size = { width: width, height: height };
	return node;
};

var createBoundingBox = function (x, y, width, height) {
	var node = new ko.Node();
	node.position = { x: x, y: y };
	node.size = { width: width, height: height};
	return new ko.BoundingBox(node);
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
	deepEqual(node.anchor, { x: 0, y: 0 });
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

test("node - add child (should throw exception A)", function () {
	throws(
        function() {
            var node = new ko.Node();
			node.addChild(node);
        },
        /Can't add a child to itself/
    );
});

test("node - add child (should throw exception B)", function () {
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

test("node - is colliding", function () {
	var node1 = createNode(100, 100, 100, 100);
	var node2 = createNode(150, 180, 100, 100);
	ok(!node1.boundingBox);
	ok(!node2.boundingBox);
	ok(node2.isColliding(node1, true));
	ok(node1.boundingBox);
	ok(node2.boundingBox);
	deepEqual(node2.position, { x: 150, y: 200 });
});

test("node - center anchor", function () {
	var node = new ko.Node();
	deepEqual(node.anchor, { x: 0, y: 0 });
	node.centerAnchor();
	deepEqual(node.anchor, { x: 0.5, y: 0.5 });
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

/* Collision */

test("bounding box - is intersecting left", function () {
	var bbox1 = createBoundingBox(100, 100, 100, 100);
	var bbox2 = createBoundingBox(50, 100, 100, 100);
	ok(bbox2.isIntersecting(bbox1));
});

test("bounding box - is intersecting rigth", function () {
	var bbox1 = createBoundingBox(100, 100, 100, 100);
	var bbox2 = createBoundingBox(150, 100, 100, 100);
	ok(bbox2.isIntersecting(bbox1));
});

test("bounding box - is intersecting top", function () {
	var bbox1 = createBoundingBox(100, 100, 100, 100);
	var bbox2 = createBoundingBox(100, 150, 100, 100);
	ok(bbox2.isIntersecting(bbox1));
});

test("bounding box - is intersecting bottom", function () {
	var bbox1 = createBoundingBox(100, 100, 100, 100);
	var bbox2 = createBoundingBox(100, 50, 100, 100);
	ok(bbox2.isIntersecting(bbox1));
});

test("bounding box - is intersecting (anchor 0.5 0.5)", function () {
	var bbox1 = createBoundingBox(100, 100, 100, 100);
	bbox1.node.anchor = { x: 0.5, y: 0.5 };
	var bbox2 = createBoundingBox(150, 150, 100, 100);
	bbox2.node.anchor = { x: 0.5, y: 0.5 };
	ok(bbox2.isIntersecting(bbox1));
});

test("bounding box - is not intersecting", function () {
	var bbox1 = createBoundingBox(100, 100, 50, 50);
	var bbox2 = createBoundingBox(150, 150, 100, 100);
	ok(!bbox2.isIntersecting(bbox1));
});

test("bounding box - separate left", function () {
	var bbox1 = createBoundingBox(100, 100, 100, 100);
	var bbox2 = createBoundingBox(75, 100, 50, 50);
	bbox2.isIntersecting(bbox1, true);
	deepEqual(bbox2.node.position, { x: 50, y: 100 });
});

test("bounding box - separate right", function () {
	var bbox1 = createBoundingBox(100, 100, 100, 100);
	var bbox2 = createBoundingBox(175, 100, 50, 50);
	bbox2.isIntersecting(bbox1, true);
	deepEqual(bbox2.node.position, { x: 200, y: 100 });
});

test("bounding box - separate top", function () {
	var bbox1 = createBoundingBox(100, 100, 100, 100);
	var bbox2 = createBoundingBox(100, 75, 50, 50);
	bbox2.isIntersecting(bbox1, true);
	deepEqual(bbox2.node.position, { x: 100, y: 50 });
});

test("bounding box - separate bottom", function () {
	var bbox1 = createBoundingBox(100, 100, 100, 100);
	var bbox2 = createBoundingBox(100, 175, 50, 50);
	bbox2.isIntersecting(bbox1, true);
	deepEqual(bbox2.node.position, { x: 100, y: 200 });
});

test("bounding box - separate (anchor 0.5 0.5)", function () {
	var bbox1 = createBoundingBox(100, 100, 100, 100);
	bbox1.node.anchor = { x: 0.5, y: 0.5 };
	var bbox2 = createBoundingBox(75, 100, 50, 50);
	bbox2.node.anchor = { x: 0.5, y: 0.5 };
	bbox2.isIntersecting(bbox1, true);
	deepEqual(bbox2.node.position, { x: 175, y: 100 });
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

/* Wait */

test("wait - create", function () {
	var wait = new ko.Wait(1);
	ok(wait instanceof ko.Action);
});

test("wait - update", function () {
	var node = new ko.Node();
	node.sequence().wait(1).scaleTo(2, 1).init(node);
	node.update(1);
	equal(node.scale, 1);
	node.update(1);
	equal(node.scale, 2);
});

/* Call */

test("call - create", function () {
	var call = new ko.Call();
	ok(call instanceof ko.Action);
});

test("call - update", function () {
	var _args;
	var call = new ko.Call(function (args) {
		_args = args;
	}, {
		name: "Ville",
		age: 2
	});
	call.init(new ko.Node());
	call.update(1);
	equal(_args.name, "Ville");
	equal(_args.age, 2);
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
	var scene = new ko.Scene({
		update: function (delta) {
			updated = true;
		}
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

/* Transition */

test("transition - create", function () {
	var sceneA = new ko.Scene();
	var sceneB = new ko.Scene();
	var transition = new ko.Transition({
		fromScene: sceneA,
		toScene: sceneB,
		duration1: 1
	});
	ok(transition instanceof ko.Scene);
});

test("transition - create (should throw exception A)", function () {
	throws(
        function() {
			var transition = new ko.Transition({});
        },
        /Must specify a scene to transition from/
    );
});

test("transition - create (should throw exception B)", function () {
	throws(
        function() {
			var transition = new ko.Transition({
				fromScene: new ko.Scene(),
				toScene: undefined,
				duration1: 1
			});
        },
        /Must specify a scene to transition to/
    );
});

test("transition - create (should throw exception C)", function () {
	throws(
        function() {
			var transition = new ko.Transition({
				fromScene: new ko.Scene(),
				toScene: new ko.Scene()
			});
        },
        /Must specify a duration/
    );
});

test("transition - update (with duration1)", function () {
	var sceneAUpdated = false;
	var sceneBUpdated = false;
	var sceneA = new ko.Scene({ 
		update: function (delta) {
			sceneAUpdated = true;
		}
	});
	var sceneB = new ko.Scene({ 
		update: function (delta) {
			sceneBUpdated = true;
		}
	});
	var transition = new ko.Transition({
		fromScene: sceneA,
		toScene: sceneB,
		duration1: 1
	});
	ko.director.scene = transition;
	transition.update(0.9);
	ok(ko.director.scene === transition);
	transition.update(0.1);
	ok(ko.director.scene === sceneB);
	ok(sceneAUpdated);
	ok(sceneBUpdated);
});

test("transition - update (with duration1 and duration2)", function () {
	var sceneAUpdated = false;
	var sceneBUpdated = false;
	var sceneA = new ko.Scene({ 
		update: function (delta) {
			sceneAUpdated = true;
		}
	});
	var sceneB = new ko.Scene({ 
		update: function (delta) {
			sceneBUpdated = true;
		}
	});
	var transition = new ko.Transition({
		fromScene: sceneA,
		toScene: sceneB,
		duration1: 1,
		duration2: 1
	});
	ko.director.scene = transition;
	transition.update(0.9);
	ok(ko.director.scene === transition);
	transition.update(0.1);
	ok(ko.director.scene === transition);
	transition.update(1);
	ok(ko.director.scene === sceneB);
	ok(sceneAUpdated);
	ok(sceneBUpdated);
});


