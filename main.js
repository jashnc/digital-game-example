
var canvas, stage, player, map, loader, help, helpToggle, help_bg, help_display, inventory;

//set up keyboard events
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

var KEYCODE_ENTER = 13;		//useful keycode
var KEYCODE_SPACE = 32;		//useful keycode
var KEYCODE_UP = 38;		//useful keycode
var KEYCODE_LEFT = 37;		//useful keycode
var KEYCODE_RIGHT = 39;		//useful keycode
var KEYCODE_DOWN = 40;
var KEYCODE_A = 65;			//key A, any other key would be 65 + the offset (i.e. B is 65+1)
var KEYCODE_H = 72;
var KEYCODE_R = 82;

var counter = 0;
var numSeeds = 0;
var numNpcs = 0;
var seeds = [];
var npcs = [];
var inventory_arr = [];
var seedImages = [];
var running = false;

//this is the initialization method that is called when the web page is first opened.
function init() {

	canvas = document.getElementById("gameCanvas");

	//stage is the 'parent' from which all visuals of the game are descended from
    //enables stage
	stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);
    stage.enableMouseOver(20);
    stage.onPress = function(mouseEvent){
        console.log("mouse pressed");

    };
    //add text
	messageField = new createjs.Text("Loading", "bold 24px Arial", "#FFFFFF");
	messageField.textAlign = "center";
	messageField.textBaseline = "middle";
	messageField.x = canvas.width / 2;
	messageField.y = canvas.width / 2;

	help = new createjs.Text("Move around using the arrow keys.\n " +
                            "Collect seeds and cross them \n" +
                            "using the Punnett Squares to get points!",
                            "30px Arial", "#000000");
    help.textAlign = "center";
    help.textBaseline = "middle";
    help.x = canvas.width / 2;
    help.y = canvas.width / 4;
    helpToggle = true;

    help_display = new createjs.Text("HELP", "bold 36px Arial", "#000000");
    help_display.x = 185;
    help_display.y = 155;
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
		{src: "sprites/3848.png", id:"map"},
		{src: "sprites/seed.png", id:"seed"},
        {src: "sprites/set3_background.png", id:"help_bg"},
        {src: "sprites/Yjrtrainerf.png", id:"npc"},
        {src: "sprites/inventory.png", id:"inventory"}
	];

	loader = new createjs.LoadQueue();
	loader.addEventListener("fileload", handleFileComplete);
	/**loader.loadFile("sprites/Yyoungster.png");
	loader.loadFile("sprites/3848.png");
	loader.loadFile("sprites/seed.png");
    loader.loadFile("sprites/set3_background.png");
    loader.loadFile("sprites/Yjrtrainerf.png");**/
	loader.loadManifest(manifest);
}


//this is called when the assets in loadAssets have been loaded fully.
function handleFileComplete(event) {

	player = new createjs.Bitmap(loader.getResult("player"));
	map = new createjs.Bitmap(loader.getResult("map"));
    help_bg = new createjs.Bitmap(loader.getResult("help_bg"));
    inventory = new createjs.Bitmap(loader.getResult("inventory"));

    inventory.x = 12;
    inventory.y = 600;

	player.x = 160;
	player.y = 195;
    help_bg.x = 180;
    help_bg.y = 150;

	stage.addChild(map);
	stage.addChild(player);
    stage.addChild(inventory);

}

//this function is the 'animation loop'; it is called every x ms where x is Ticker.framerate
function tick(event) {
    if(counter % 250 == 0 && counter != 0){
        if (numSeeds < 5) {
			numSeeds++;
            randomSeedPlacer();
        }
    }
	if(counter % 750 == 0 && counter != 0){
		if (numNpcs < 5){
			numNpcs++;
			randomNpcPlacer();
		}
	}
	counter++;
	var x = player.x;
	var y = player.y;

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
	if(!e) {
		var e = window.event;
	}
	switch(e.keyCode) {
		case KEYCODE_RIGHT:
			var movement = running ? 10 : 5;
			if(inBounds(player.x + movement, player.y)) {
				player.x += movement;
				var seed = pickUpSeeds(player.x, player.y);
				if (seed != null){
					console.log("deez nuts");
					addToInventory(seed);
					removeSeed(seed);
				}
			}
			return false;
		case KEYCODE_LEFT:
			var movement = running ? 10 : 5;
			if(inBounds(player.x - movement, player.y)){
				player.x -= movement;
				var seed = pickUpSeeds(player.x, player.y);
				if (seed != null){
					console.log("deez nuts");
					addToInventory(seed);
					removeSeed(seed);
				}
			}
			return false;
		case KEYCODE_UP:
			var movement = running ? 10 : 5;
			if(inBounds(player.x, player.y - movement)){
				player.y -= movement;
				var seed = pickUpSeeds(player.x, player.y);
				if (seed != null){
					console.log("deez nuts");
					addToInventory(seed);
					removeSeed(seed);
				}
			}
			return false;
		case KEYCODE_DOWN:
			var movement = running ? 10 : 5;
			if(inBounds(player.x, player.y + movement)){
				player.y += movement;
				var seed = pickUpSeeds(player.x, player.y);
				if (seed != null){
					console.log("deez nuts");
					addToInventory(seed);
					removeSeed(seed);
				}
			}
			return false;
		case KEYCODE_SPACE:
			console.log("player (" + player.x + ", " + player.y + ")");
			for(var i = 0; i < seeds.length; i++) {
				console.log("seed (" + seeds[i].x + ", " + seeds[i].y + ")");
			}
			console.log(numSeeds);
            console.log(inventory_arr);
            return false;
		case KEYCODE_H:
			console.log("Help menu");
            helpText();
            return false;
		case KEYCODE_R:
			running = true;
		default:
			console.log(e.keyCode);
	}
}

/**
 * Helper function to generate random x and y locations
 * @returns array with x and y locations
 */
function genRandXY(){
    do {
        var randomX = Math.random()*canvas.width;
        var randomY = Math.random()*canvas.height;
    }
    while(!inBounds(randomX, randomY));
    return [randomX, randomY];
}

/**
 * Checks for the objects to have same locations
 * TODO: check within an area to make sure items don't overlap, since this only checks x and y but doesn't check for overlap
 * @param obj first object to check against
 * @param otherObj second object to check against
 * @returns the array of random locations from genRandXY
 */
function checkSameLoc(obj, otherObj) {
    var rand = genRandXY();
    var dup = true;
    while (dup) {
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].x == rand[0] && obj[i].y == rand[1]) {
                dup = false;
                rand = genRandXY();
            }
        }
        for (var i = 0; i < otherObj.length; i++) {
            if (otherObj[i].x == rand[0] && otherObj[i].y == rand[1]) {
                dup = false;
                rand = genRandXY();
            }
        }
        dup = !dup;
    }
    return rand;
}


function randomSeedPlacer(){
    var obj = seeds;
    var otherObj = npcs;
	var rand = checkSameLoc(obj, otherObj);
    var seed = new Seed(rand[0], rand[1]);
    var seedImage = new createjs.Bitmap(loader.getResult("seed"));
    seedImage.addEventListener("mouseover", function(){
        console.log("mouseover");
    });
    seedImage.x = rand[0];
    seedImage.y = rand[1];
    stage.addChild(seedImage);
    seeds.push(seed);
	seedImages.push(seedImage);
}

function randomNpcPlacer(){
    var obj = npcs;
    var otherObj = seeds;
    var rand = checkSameLoc(obj, otherObj);
    var npc = new Npc(rand[0], rand[1]);
    var npcImage = new createjs.Bitmap(loader.getResult("npc"));
    npcImage.x = rand[0];
    npcImage.y = rand[1];
    stage.addChild(npcImage);
    npcs.push(npc);

}


function handleKeyUp(e) {
	if(!e)
		var e = window.event;
	switch(e.keyCode) {
		case KEYCODE_R:
			running = false;
		default:
			var deeznuts = 'deez nuts hahahaha';
			//be a fucking bagel
	}
}

var genotypes = ["Aa", "AA", "aa", "Bb", "BB", "bb", "Cc", "CC", "cc"];

function Npc(x, y, png){
    this.x = x;
    this.y = y;
    this.png = png;
}

function Seed(x, y){
    this.x = x;
    this.y = y;
    var index = Math.floor(Math.random()*genotypes.length);
    this.genotype = genotypes[index];
}

function addToInventory(seed) {
    inventory_arr.push(seed);
	paintInventory();
}

function paintInventory() {
    for(var i = 0; i < inventory_arr.length; i++) {
        var seed = new createjs.Bitmap(loader.getResult("seed"));
		(function(index) {
			seed.addEventListener("mouseover", function () {
				console.log(inventory_arr[index].genotype)
			});
		})(i);
        seed.setTransform((i*132)+53, 630, 2, 2);
        stage.addChild(seed);
		messageField = new createjs.Text(inventory_arr[i].genotype, "bold 24px Arial", "#FFFFFF");
		messageField.x = ((i*132)+53);
		messageField.y = 674;
		stage.addChild(messageField);

    }
}

function pickUpSeeds(x, y){
	if(inventory_arr.length == 8){
		return null;
	}
	for (var i = 0; i < seeds.length; i++){
		if(seeds[i] != null) {
			var seedCenterX = seeds[i].x + 10;

			var seedCenterY = seeds[i].y + 10;

			if (Math.abs(x - seedCenterX) < 20 && Math.abs(y - seedCenterY) < 20) {
				stage.removeChild(seedImages[i]);
				seedImages.splice(i, 1);
				return seeds[i];
			}
		}
	}
	return null;
}

function removeSeed(seed) {
	for(var i = 0; i < seeds.length; i++) {
		if(seeds[i] === seed) {
			seeds.splice(i, 1);
			numSeeds--;
			break;
		}
	}
}

/**
 * Displays the help text on the screen. This is called when the user presses H
 */
function helpText(){
    if (helpToggle){
        stage.addChild(help_bg);
        stage.addChild(help_display);
        stage.addChild(help);
        helpToggle = !helpToggle;
    }
    else{
        stage.removeChild(help_bg);
        stage.removeChild(help_display);
        stage.removeChild(help);
        helpToggle = !helpToggle;
    }
}