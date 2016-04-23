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
		{src: "sprites/Yyoungster.png", id: "player"},
		{src: "sprites/3848.png", id:"map"}
	];

	loader = new createjs.LoadQueue();
	loader.addEventListener("fileload", handleFileComplete);
	loader.loadFile("sprites/Yyoungster.png");
	loader.loadFile("sprites/3848.png");
	loader.loadManifest(manifest);
}


//this is called when the assets in loadAssets have been loaded fully.
function handleFileComplete(event) {

	
	player = new createjs.Bitmap(loader.getResult("player"));
	map = new createjs.Bitmap(loader.getResult("map"));
	player.x = 160;
	player.y = 195;

	stage.addChild(map);
	stage.addChild(player);
}

//this function is the 'animation loop'; it is called every x ms where x is Ticker.framerate
function tick(event) {

	var x = player.x;
	var y = player.y;

	/*if(x < 150)
		player.x = 150;
	if(x > 900)
		player.x= 900;
	if(y < 70)
		player.y = 70;
	if(y > 510)
		player.y = 510;
	if(y > 260 && y <= 385 && x > 815 && x <= 900) {
		if (y < 260+(385-260)/2)
			player.y = player.y-5;
		else if (y > 260+(395-260)/2)
			player.y = player.y+5;
		else if (x < 815+(900-815)/2)
			player.x = player.x-5;
		else if (x > 815+(900-815)/2)
			player.x = player.x+5;
	}
	if(y > 260 && y <= 385 && x > 815 && x <= 900) {
		if (y < 260+(385-260)/2)
			player.y = player.y-5;
		else if (y > 260+(395-260)/2)
			player.y = player.y+5;
		else if (x < 815+(900-815)/2)
			player.x = player.x-5;
		else if (x > 815+(900-815)/2)
			player.x = player.x+5;
	}*/

	//update stage
	stage.update(event);
}
function inBounds(x, y){
	//return true;
	//very efficient and fantastic code do not copy pls
	if ((x >= 155 && y >= 190 && x <= 220 && y <= 510) ||
		(x >= 155 && y >= 475 && x <= 475 && y <= 510) ||
		(x >= 220 && y >= 410 && x <= 380 && y <= 510) ||
		(x >= 280 && y >= 390 && x <= 380 && y <= 510) ||
		(x >= 280 && y >= 60 && x <= 350 && y <= 510) ||
		(x >= 280 && y >= 60 && x <= 475 && y <= 145) ||
		(x >= 410 && y >= 60 && x <= 475 && y <= 350) ||
		(x >= 440 && y >= 350 && x <= 620 && y <= 385) ||
		(x >= 855 && x <= 910 && y >= 375 && y <= 510) ||
		(x >= 730 && x <= 910 && y >= 375 && y <= 375) ||
		(x >= 730 && x <= 795 && y >= 455 && y <= 510) ||
		(x >= 730 && x <= 815 && y >= 220 && y <= 455) ||
		(x >= 535 && x <= 910 && y >= 220 && y <= 260) ||
		(x >= 855 && x <= 910 && y >= 55 && y <= 260) ||
		(x >= 535 && x <= 910 && y >= 55 && y <= 100) ||
		(x >= 535 && x <= 605 && y >= 55 && y <= 385) ||
		(x >= 535 && x <= 620 && y >= 305 && y <= 385) ||
		(x >= 440 && x <= 620 && y >= 350 && y <= 385) ||
		(x >= 535 && y >= 215 && x <= 780 && y <= 290) ||
		(x >= 730 && y >= 375 && x <= 905 && y <= 450) ||
			//this box used to fix david's trolling
		(x >= 535 && y >= 225 && x <= 620 && y <= 385))
		return true;
	return false;
}


//handles keyboard events
function handleKeyDown(e) {
	if(!e)
		var e = window.event;
	switch(e.keyCode) {
		case KEYCODE_RIGHT:
			if(inBounds(player.x + 5, player.y)){
				player.x += 5;
			}
			return false;
		case KEYCODE_LEFT:
			if(inBounds(player.x - 5, player.y)){
				player.x -= 5;
			}
			return false;
		case KEYCODE_UP:
			if(inBounds(player.x, player.y - 5)){
				player.y -= 5;
			}
			return false;
		case KEYCODE_DOWN:
			if(inBounds(player.x, player.y + 5)){
				player.y += 5;
			}
			return false;
		case KEYCODE_SPACE:
			console.log("(" + player.x + ", " + player.y + ")");
	}
}



function handleKeyUp(e) {

}