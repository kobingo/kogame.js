/*global ko, test, throws, ok, equal, deepEqual*/

var createSceneAndSetDirector = function (child) {
	var scene = new ko.Scene();
	if (child) {
		scene.addChild(child);
	}
	ko.director.scene = scene;
	return scene;
};

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

var updateGame = function (delta, times) {
	var t = times || 1;
	// If we don't init game before update it will crash due to renderer
	// has not been created
	assertGameIsInitialized();
	for (var i = 0; i < t; i++) {
		ko.game.update(delta);
	}
};

test("run game - should throw exception", function () {
	throws(
        function() {
            ko.game.run();
        },
        /Game has not been initialized/
    );
});

test("initialize game - should throw exception", function () {
	throws(
        function() {
            ko.game.init();
        },
        /Couldn't find canvas 'undefined'/
    );
});

test("initialize game", function () {
	ko.game.init('game');
	ok(ko.game.initialized);
});

test("node - initialization", function () {
	var node = new ko.Node();
	equal(node.rotation, 0);
	equal(node.scale, 1);
	equal(node.opacity, 1);
	ok(node.visible);
	equal(node.color, 'rgb(255,255,255)');
});

test("add child - should throw exception 1", function () {
	throws(
        function() {
            var node = new ko.Node();
			node.addChild(node);
        },
        /Can't add a child to itself/
    );
});

test("add child - should throw exception 2", function () {
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

test("add child", function () {
	var node1 = new ko.Node();
    var node2 = new ko.Node();
	node1.addChild(node2);
	equal(node1._children[0], node2);
	equal(node2.parent, node1);
});

test("perform move to - duration is zero", function () {
	var pos = { x:100, y:50 };
	var moveTo = new ko.MoveTo(pos, 0);
	var node = createNodeAndPerformAction(moveTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(0);
	deepEqual(node.position, pos);
});

test("perform move to - update with delta 1.0", function () {
	var pos = { x:100, y:50 };
	var moveTo = new ko.MoveTo(pos, 1);
	var node = createNodeAndPerformAction(moveTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(1);
	deepEqual(node.position, pos);
});

test("perform move to - update with delta 0.5", function () {
	var pos = { x:100, y:50 };
	var moveTo = new ko.MoveTo(pos, 1);
	var node = createNodeAndPerformAction(moveTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(0.5);
	deepEqual(node.position, { x:pos.x/2, y:pos.y/2 });
});

test("perform move to - update with delta 2.0", function () {
	var pos = { x:100, y:50 };
	var moveTo = new ko.MoveTo(pos, 1);
	var node = createNodeAndPerformAction(moveTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(2);
	deepEqual(node.position, pos);
});

test("perform scale to - update with delta 1.0", function () {
	var scale = 1.5;
	var scaleTo = new ko.ScaleTo(scale, 1);
	var node = createNodeAndPerformAction(scaleTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(1);
	equal(node.scale, scale);
});

test("perform scale to - update with delta 0.5", function () {
	var scale = 1.5;
	var scaleTo = new ko.ScaleTo(scale, 1);
	var node = createNodeAndPerformAction(scaleTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(0.5);
	equal(node.scale, 1.25);
});

test("perform scale to - update with delta 2.0", function () {
	var scale = 0.5;
	var scaleTo = new ko.ScaleTo(scale, 1);
	var node = createNodeAndPerformAction(scaleTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(2);
	equal(node.scale, scale);
});

test("perform rotate to - update with delta 1.0", function () {
	var rotate = Math.PI * 2;
	var rotateTo = new ko.RotateTo(rotate, 1);
	var node = createNodeAndPerformAction(rotateTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(1);
	equal(node.rotation, rotate);
});

test("perform rotate to - update with delta 0.5", function () {
	var rotate = Math.PI;
	var rotateTo = new ko.RotateTo(rotate, 1);
	var node = createNodeAndPerformAction(rotateTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(0.5);
	equal(node.rotation, rotate * 0.5);
});

test("perform rotate to - update with delta 2.0", function () {
	var rotate = Math.PI * 3;
	var rotateTo = new ko.RotateTo(rotate, 1);
	var node = createNodeAndPerformAction(rotateTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(2);
	equal(node.rotation, rotate);
});

test("perform fade to - update with delta 1.0", function () {
	var opacity = 0;
	var fadeTo = new ko.FadeTo(opacity, 1);
	var node = createNodeAndPerformAction(fadeTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(1);
	equal(node.opacity, opacity);
});

test("perform fade to - update with delta 0.5", function () {
	var opacity = 0.5;
	var fadeTo = new ko.FadeTo(opacity, 1);
	var node = createNodeAndPerformAction(fadeTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(0.5);
	equal(node.opacity, 0.75);
});

test("perform fade to - update with delta 2.0", function () {
	var opacity = 0;
	var fadeTo = new ko.FadeTo(opacity, 1);
	var node = createNodeAndPerformAction(fadeTo);
	var scene = createSceneAndSetDirector(node);
	updateGame(2);
	equal(node.opacity, opacity);
});

test("perform sequence - with three actions", function () {
	var sequence = new ko.Sequence([
		new ko.FadeTo(0, 1), 
		new ko.ScaleTo(1.5, 1), 
		new ko.RotateTo(Math.PI * 2, 1)
	], 1);
	var node = createNodeAndPerformAction(sequence);
	var scene = createSceneAndSetDirector(node);
	updateGame(1, 3);
	equal(node.opacity, 0);
	equal(node.scale, 1.5);
	equal(node.rotation, Math.PI * 2);
});

test("perform sequence - one action with zero duration", function () {
	var sequence = new ko.Sequence([
		new ko.MoveTo({ x:25, y:25 }, 1),
		new ko.MoveTo({ x:100, y:100 }, 0),
		new ko.MoveTo({ x:55, y:55 }, 1)
	], 1);
	var node = createNodeAndPerformAction(sequence);
	var scene = createSceneAndSetDirector(node);
	updateGame(1);
	deepEqual(node.position, { x:100, y:100 });
	updateGame(1);
	deepEqual(node.position, { x:55, y:55 });
});

test("perform sequence", function () {
	var sequence = new ko.Sequence([
		new ko.FadeTo(0, 1),
		new ko.FadeTo(1, 0)
	], 1);
	var node = createNodeAndPerformAction(sequence);
	var scene = createSceneAndSetDirector(node);
	updateGame(1);
	equal(node.opacity, 1);
});



