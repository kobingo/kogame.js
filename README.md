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
Download the latest version of [kogame.js](https://raw.github.com/kobingo/kogame.js/master/kogame-0.1.0.js) 
then write the following code in a html file.

    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="utf-8" />
        <title>kogame.js</title>
    </head>
    <body>
        <canvas id="game" width="768" height="432"></canvas>
        <script type="text/javascript" src="kogame-0.1.0.js"></script>
        <script type="text/javascript">
            ko.game.init('game');
    		ko.game.run();
        </script>
    </body>
    </html>

Open the html file in your browser, if everything works correctly there should be a blue rectangle on the screen.

Examples
--------
* Draw a sprite