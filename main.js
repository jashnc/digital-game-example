var canvas, stage, message, player, map, loader, ticker, preload;

//set up keyboard events
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

var KEYCODE_ENTER = 13;		//useful keycode
var KEYCODE_SPACE = 32;		//useful keycode
var KEYCODE_UP = 38;		//useful keycode
var KEYCODE_LEFT = 37;		//useful keycode
var KEYCODE_RIGHT = 39;		//useful keycode
var KEYCODE_DOWN = 40;

//this is the initialization method that is called when the web page is first opened.
function init() {
	canvas = document.getElementById("gameCanvas");
	//stage is the 'parent' from which all visuals of the game are descended from
	stage = new createjs.Stage(canvas);

	//add text
	messageField = new createjs.Text("Loading", "bold 24px Arial", "#FFFFFF");
	messageField.textAlign = "center";
	messageField.textBaseline = "middle";
	messageField.x = canvas.width / 2;
	messageField.y = canvas.width / 2;

	//add the message object to the stage
	stage.addChild(messageField);
	
	loadAssets();
	
	//sets up the animation loop
	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.framerate = 60;

}

//this method is used to load all our sprites/sounds, etc. 
function loadAssets() {

	//the manifest is a mapping of these files to an id that you can use 
	var manifest = [
		{src: "./sprites/Yyoungster.png", id: "player"},
		{src: "./sprites/3848.png", id: "map"}
		];
	
	loader = new createjs.LoadQueue();
	loader.addEventListener("fileload", handleFileComplete);
	loader.loadFile("sprite.png");
	loader.loadManifest(manifest);
}


//this is called when the assets in loadAssets have been loaded fully. 
function handleFileComplete(event) {
	player = new createjs.Bitmap(loader.getResult("player"));
	player.x = canvas.width / 2;

	map = new createjs.Bitmap(loader.getResult("map"));

	stage.addChild(map);
	stage.addChild(player);
}

//this function is the 'animation loop'; it is called every x ms where x is Ticker.framerate
function tick(event) {
	var x = player.x;
	var y = player.y;

	if(x < 0)
		player.x = 0;
	if(x > 410)
		player.x= 410;
	if(y < 0)
		player.y = 0;
	if(y > 250)
		player.y = 250;
	
	//update stage
	stage.update(event);
}

//handles keyboard events
function handleKeyDown(e) {
	if(!e)
		var e = window.event;
	switch(e.keyCode) {
		case KEYCODE_RIGHT:
			player.x+=5;
			return false;
		case KEYCODE_LEFT:
			player.x-=5;
			return false;
		case KEYCODE_UP:
			player.y-=5;
			return false;
		case KEYCODE_DOWN:
			player.y+=5;
			return false;
	}
}

function handleKeyUp(e) {

}