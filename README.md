Kogame.js
=========
A high-level framework for creating games with HTML5 and JavaScript.

Features
--------
* Scenes
* Actions
* Input
* Sprites
* Menus

Getting started
---------------
Download the latest version of [Kogame.js](https://raw.github.com/kobingo/kogame.js/master/kogame-0.1.0.js) 
then create a html file with the following markup.

    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="utf-8" />
        <title>kogame.js</title>
    </head>
    <body>
        <canvas id="game" width="768" height="432"></canvas>
        <script type="text/javascript" src="script/kogame-0.1.0.js"></script>
        <script type="text/javascript">
            // Init the game
            ko.game.init('game');
            // Create a sequence of actions
            var sequence = new ko.Sequence([
                new ko.MoveTo({ 
            		x: ko.renderer.center.x, 
            		y: ko.renderer.center.y }, 1,
            		ko.actionEase.backInOut),
            	new ko.Wait(2),
            	new ko.FadeTo(0, 0.5, ko.actionEase.sineInOut),
            	new ko.MoveTo({ x: ko.renderer.center.x, y: -100 }, 0),
            	new ko.FadeTo(1, 0)
            ]);
            // Create a label and perform the sequence
            var label = new ko.Label("Kogame.js", "48px Comic Sans MS");
            label.anchor = { x: 0.5, y: 0.5 };
            label.position = { x: ko.renderer.center.x, y: -100 };
            label.perform(sequence);
            // Create a scene and add the label
            var scene = new ko.Scene();
            scene.addChild(label);
            // Run the game
            ko.game.run(scene);
        </script>
    </body>
    </html>

Examples
--------
* Draw a sprite