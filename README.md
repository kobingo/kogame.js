Kogame.js
=========
Framework for creating 2D games with HTML5 and JavaScript. Currently in beta.

Getting started
---------------
Download the latest version of [Kogame.js](https://raw.github.com/kobingo/kogame.js/master/kogame-0.6.0.js) 
then create a html file with the following markup.

    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="utf-8" />
        <title>Kogame.js</title>
    </head>
    <body>
        <canvas id="game" width="768" height="432"></canvas>
        <script type="text/javascript" src="kogame-0.6.0.js"></script>
        <script type="text/javascript">
            ko.game.init('game');
    
            var center = ko.graphics.center;
    
            var label = new ko.Label("Kogame.js", "48px Comic Sans MS");
            label.centerAnchor();
            label.position = { x: center.x, y: -100 };
    
            label.performSequence().
                moveTo(center.x, center.y, 1, ko.actionEase.backInOut).
                wait(1).
                fadeTo(0, 0.5, ko.actionEase.sineInOut).
                moveTo(center.x, -100, 0).
                fadeTo(1, 0);
    
            var scene = new ko.Scene();
            scene.addChild(label);
    
            ko.game.run(scene);
        </script>
    </body>
    </html>
