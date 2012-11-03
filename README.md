kogame.js
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
Download the latest version of [kogame.js](https://github.com/kobingo/kogame.js/blob/master/kogame.js) 
then write the following code in a html file.

    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="utf-8" />
        <title>kogame.js</title>
    </head>
    <body>
        <canvas id="game" width="768" height="432"></canvas>
        <script type="text/javascript" src="kogame.js"></script>
        <script type="text/javascript">
            var canvas = document.getElementById('game');
            ko.game.init(canvas);
            ko.game.run();
        </script>
    </body>
    </html>

Open the html file in your browser. If everything works correctly there should be a blue rectangle on the screen.

Examples
--------
* Draw a sprite