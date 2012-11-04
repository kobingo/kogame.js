/*global test, throws, ok, ko*/

test("initialize game", function () {
	ko.game.init('game');
	ok(ko.game.initialized, "game is not initialized");
});

test("initialize game - should throw exception", function () {
	throws(
        function() {
            ko.game.init();
        },
        /Couldn't find canvas 'undefined'/,
        "should throw exception when initalizing game"
    );
});

test("keyboard - iskeydown", function () {
	ko.game.init('game');
	ok(!ko.keyboard.isKeyDown(ko.keyboard.ENTER), "enter key should not be down");
});