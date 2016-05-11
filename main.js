var canvas, stage, player, map, loader, help1, help2, help3, helpToggle, help_bg, help_display, inventory, punnett, staminaShape, crossClicked;

//set up keyboard events
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

var KEYCODE_ENTER = 13;     //useful keycode
var KEYCODE_SPACE = 32;     //useful keycode
var KEYCODE_UP = 38;        //useful keycode
var KEYCODE_LEFT = 37;      //useful keycode
var KEYCODE_RIGHT = 39;     //useful keycode
var KEYCODE_DOWN = 40;
var KEYCODE_A = 65;         //key A, any other key would be 65 + the offset (i.e. B is 65+1)
var KEYCODE_H = 72;
var KEYCODE_R = 82;
var KEYCODE_P = 80;
var KEYCODE_T = 84;
var KEYCODE_1 = 49;
var KEYCODE_2 = 50;
var KEYCODE_3 = 51;
var KEYCODE_4 = 52;
var KEYCODE_5 = 53;
var KEYCODE_6 = 54;
var KEYCODE_7 = 55;
var KEYCODE_8 = 56;

var counter = 0;
var numSeeds = 0;
var numNpcs = 0;
var seeds = [];
var npcs = [];
var inventory_arr = [];
var seedImages = [];
var speechBubbles = [];
var speechTexts = [];
var running = false;
var punnettToggle = false;
var leftSide = false;
var punnettImages = [];
var punnetText = [];
var crossButton = [];
var punnettSeeds = [];
var inventorySeeds = [];
var messageFields = [];
var probabilities = {};
var npcImages = [];
var score = 12;
var score_text = " ";
var stamina = 400;
var noRun = false;
var gameLost = false;

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
		{src: "sprites/3848.png", id:"map"},
		{src: "sprites/yellow_seed.png", id:"seed"},
		{src: "sprites/set3_background.png", id:"help_bg"},
		{src: "sprites/Yjrtrainerf.png", id:"npc"},
		{src: "sprites/inventory.png", id:"inventory"},
		{src: "sprites/speech_bubble.png", id: "speechbubble"},
		{src: "sprites/punnett.png", id:"punnett"}
	];

	loader = new createjs.LoadQueue();
	loader.addEventListener("fileload", handleFileComplete);
	loader.loadManifest(manifest);
}


//this is called when the assets in loadAssets have been loaded fully.
function handleFileComplete(event) {

	player = new createjs.Bitmap(loader.getResult("player"));
	map = new createjs.Bitmap(loader.getResult("map"));
	help_bg = new createjs.Bitmap(loader.getResult("help_bg"));
	inventory = new createjs.Bitmap(loader.getResult("inventory"));
	punnett = new createjs.Bitmap(loader.getResult("punnett"));

	punnett.x = 300;
	punnett.y = 150;

	inventory.x = 12;
	inventory.y = 600;

	player.x = 160;
	player.y = 195;
	help_bg.x = 180;
	help_bg.y = 150;

	stage.addChild(map);
	stage.addChild(player);
	stage.addChild(inventory);

	var shape = new createjs.Shape();
	shape.graphics.beginFill("#000000").drawRect(950, 50, 100, 75);
	stage.addChild(shape);
	score_text = new createjs.Text("Score: \n" + "    " + score,
		"24px Arial", "#FFFFFF");
	score_text.x = 969;
	score_text.y = 60;
	stage.addChild(score_text);

	staminaShape = new createjs.Shape();
	staminaShape.graphics.beginStroke("#000");
	staminaShape.graphics.setStrokeStyle(1);
	staminaShape.snapToPixel = true;
	staminaShape.graphics.beginFill("#FFA500").drawRect(977, 150, 50, 400);
	stage.addChild(staminaShape);

	help1 = new createjs.Text("Reach a score of 50 to beat this tutorial! \n\n" +
		"Move Xerxes around using the arrow keys.  " +
		"Collect seeds for 1 point, \n cross them " +
		"using the Punnett Square to get new seeds, " +
		"and turn the \n right seed in to a person by pressing 'T' when near them for 10 points!\n  Don't let your score fall to 0, " +
		"get started quick!\n"+
		"---------------------------------------------------------------------------------------------",
		"20px Arial", "#1b1e1e");
	help1.textAlign = "center";
	help1.x = canvas.width / 2;
	help1.y = (canvas.width/4) - 90;
	help2 = new createjs.Text("-Punnett Squares are diagrams that help determine an outcome of crossing two different traits\n"+
		"-In this game, we use different seeds with traits to cross them into a new seed with mixed traits\n"+
		"-Pick up seeds by running over them\n"+
		"-Hold 'R' to run at cost of your stamina bar\n"+
		"-Press 'P' to open your Punnett Square to cross seeds\n"+
		"-Click on seeds in your inventory with the Punnett Square open to cross them\n"+
		"  (you need at least 2 seeds to cross, and you're not always guaranteed to\n   get an exact type you want!)\n"+
		"-Press 1-8 keys to drop a seed in the corresponding inventory slot\n"+
		"-Press 'H' to open/close this menu\n",
		"16px Arial", "#1b1e1e");
	help2.x = (canvas.width / 2) - 340;
	help2.y = (canvas.width/4) + 55;
	helpToggle = true;

	help_display = new createjs.Text("HELP", "bold 36px Arial", "#1b1e1e");
	help_display.x = 185;
	help_display.y = 155;
	stage.addChild(help_bg);
	stage.addChild(help_display);
	stage.addChild(help1);
	stage.addChild(help2);
}

//this function is the 'animation loop'; it is called every x ms where x is Ticker.framerate
function tick(event) {
	if(counter == 10000){
		counter = 0;
	}
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
	if(counter % 400 == 0 && counter != 0){
		score--;
		updateScore();
	}
	if(stamina == 0){
		noRun = true;
	}
	if(running == true){
		if(stamina == 0){
			noRun = true;
		}
		else {
			stamina -= 1;
		}
	}
	if(running == false && stamina != 400){
		if(stamina + 1.5 > 400){
			stamina = 400;
		}
		else {
			stamina += 1.5;
		}
	}
	updateStamina();
	punnettOnTop();
	helpOnTop();
	if(score >= 50 || score <= 0) {
		if (score <= 0){
			gameLost = true;
		}
		endGame();
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
			var movement = running ? 15 : 5;
			if(stamina <= 0){
				noRun = true;
				running = false;
			}
			if(noRun){
				movement = 5;
			}
			if(inBounds(player.x + movement, player.y)) {
				player.x += movement;
				var seed = pickUpSeeds(player.x, player.y);
				if (seed != null){
					addToInventory(seed);
					removeSeed(seed);
				}
			}
			return false;
		case KEYCODE_LEFT:
			var movement = running ? 15 : 5;
			if(stamina <= 0){
				noRun = true;
				running = false;
			}
			if(noRun){
				movement = 5;
			}
			if(inBounds(player.x - movement, player.y)){
				player.x -= movement;
				var seed = pickUpSeeds(player.x, player.y);
				if (seed != null){
					addToInventory(seed);
					removeSeed(seed);
				}
			}
			return false;
		case KEYCODE_UP:
			var movement = running ? 15 : 5;
			if(stamina <= 0){
				noRun = true;
				running = false;
			}
			if(noRun){
				movement = 5;
			}
			if(inBounds(player.x, player.y - movement)){
				player.y -= movement;
				var seed = pickUpSeeds(player.x, player.y);
				if (seed != null){
					addToInventory(seed);
					removeSeed(seed);
				}
			}
			return false;
		case KEYCODE_DOWN:
			var movement = running ? 15 : 5;
			if(stamina <= 0){
				noRun = true;
				running = false;
			}
			if(noRun){
				movement = 5;
			}
			if(inBounds(player.x, player.y + movement)){
				player.y += movement;
				var seed = pickUpSeeds(player.x, player.y);
				if (seed != null){
					addToInventory(seed);
					removeSeed(seed);
				}
			}
			return false;
		case KEYCODE_SPACE:
			/*console.log("player (" + player.x + ", " + player.y + ")");
			for(var i = 0; i < seeds.length; i++) {
				console.log("seed (" + seeds[i].x + ", " + seeds[i].y + ")");
			}
			console.log(numSeeds);
			console.log(inventory_arr);
			console.log(crossButton);*/
			return false;
		case KEYCODE_H:
			helpToggle = !helpToggle;
			helpText();
			return false;
		case KEYCODE_R:
			if(noRun){
				running = false;
			}
			else {
				running = true;
			}
			return false;
		case KEYCODE_P:
			punnettToggle = !punnettToggle;
			for(var j = 0; j < inventory_arr.length; j++){
				inventory_arr[j].clicked = false;
			}
			drawPunnett(punnettToggle);
			return false;
		case KEYCODE_T:
			giveSeed();
			return false;
		case KEYCODE_1:
		case KEYCODE_2:
		case KEYCODE_3:
		case KEYCODE_4:
		case KEYCODE_5:
		case KEYCODE_6:
		case KEYCODE_7:
		case KEYCODE_8:
			deleteSeed(e.keyCode);
			return false;
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
		var randomX = Math.floor(Math.random()*canvas.width);
		var randomY = Math.floor(Math.random()*canvas.height);
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
	for (var i = 0; i < obj.length; i++) {
		if (Math.abs((rand[0] - obj[i].x)) <= 50 && Math.abs((rand[1] - obj[i].y)) <= 50) {
			rand = genRandXY();
		}
	}
	for (var i = 0; i < otherObj.length; i++) {
		if (Math.abs((rand[0] - otherObj[i].x)) <= 50 && Math.abs((rand[1] - otherObj[i].y)) <= 50) {
			rand = genRandXY();
		}
	}
	return rand;
}


function randomSeedPlacer(){
	var obj = seeds;
	var otherObj = npcs;
	var rand = checkSameLoc(obj, otherObj);
	var seed = new Seed(rand[0], rand[1]);
	var seedImage = new createjs.Bitmap(loader.getResult("seed"));
	/*seedImage.addEventListener("mouseover", function(){
	 console.log("mouseover");
	 });*/
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
	npcImages.push(npcImage);
	npcs.push(npc);
	var speechbubble = new createjs.Bitmap(loader.getResult("speechbubble"));
	speechbubble.x = npcImage.x;
	speechbubble.y = npcImage.y - 20;
	speechText = new createjs.Text(genotypeCrosses[Math.floor(Math.random()*genotypeCrosses.length)], "bold 24px Arial", "#000000");
	speechText.x = speechbubble.x + 5;
	speechText.y = speechbubble.y;
	stage.addChild(speechbubble);
	speechBubbles.push(speechbubble);
	stage.addChild(speechText);
	speechTexts.push(speechText);
}


function handleKeyUp(e) {
	if(!e)
		var e = window.event;
	switch(e.keyCode) {
		case KEYCODE_R:
			running = false;
	}
}

var rareGenotypes = ["AA", "aa", "BB", "bb", "CC", "cc"];
var genotypes = ["Aa", "Bb", "Cc"];
var genotypeCrosses = ["Ab", "Ac", "Ba", "Bc", "Ca", "Cb", "ab", "ac", "bc", "AB", "AC", "BC"];

function Npc(x, y, png){
	this.x = x;
	this.y = y;
	this.png = png;
}

function Seed(x, y){
	this.x = x;
	this.y = y;
	var rand = Math.random();
	if (rand <= 1/5){
		var index = Math.floor(Math.random()*rareGenotypes.length);
		this.genotype = rareGenotypes[index];
	}
	else{
		var index = Math.floor(Math.random()*genotypes.length);
		this.genotype = genotypes[index];
	}
	this.clicked = false;
}

function addToInventory(seed) {
	score++;
	updateScore();
	inventory_arr.push(seed);
	paintInventory();
}

function paintInventory() {
	for(var kush = 0; kush < inventorySeeds.length; kush++){
		stage.removeChild(inventorySeeds[kush]);
		stage.removeChild(messageFields[kush]);
	}
	inventorySeeds = [];
	messageFields = [];
	for(var i = 0; i < inventory_arr.length; i++) {
		var seed = new createjs.Bitmap(loader.getResult("seed"));
		(function(index) {
			seed.addEventListener("click", function () {
				if(punnettToggle) {
					if (!inventory_arr[index].clicked) {
						inventory_arr[index].clicked = true;
						if (!leftSide) {
							var otherSeed = new createjs.Bitmap(loader.getResult("seed"));
							otherSeed.setTransform(230, 320, 2, 2);
							stage.addChild(otherSeed);
							punnettImages.push(otherSeed);
							var firstG = new createjs.Text(inventory_arr[index].genotype.substring(0, 1), "bold 36px Arial", "#FFFFFF");
							var secondG = new createjs.Text(inventory_arr[index].genotype.substring(1, 2), "bold 36px Arial", "#FFFFFF");
							firstG.x = 270;
							firstG.y = 220;
							secondG.x = 270;
							secondG.y = 420;
							stage.addChild(firstG);
							stage.addChild(secondG);
							punnetText.push(firstG);
							punnetText.push(secondG);
							leftSide = !leftSide;
							punnettSeeds.push(inventory_arr[index]);
						}
						else {
							var otherSeed = new createjs.Bitmap(loader.getResult("seed"));
							otherSeed.setTransform(480, 80, 2, 2);
							stage.addChild(otherSeed);
							punnettImages.push(otherSeed);
							var firstG = new createjs.Text(inventory_arr[index].genotype.substring(0, 1), "bold 36px Arial", "#FFFFFF");
							var secondG = new createjs.Text(inventory_arr[index].genotype.substring(1, 2), "bold 36px Arial", "#FFFFFF");
							firstG.x = 400;
							firstG.y = 100;
							secondG.x = 600;
							secondG.y = 100;
							stage.addChild(firstG);
							stage.addChild(secondG);
							punnetText.push(firstG);
							punnetText.push(secondG);
							leftSide = !leftSide;
							punnettSeeds.push(inventory_arr[index]);
						}
					}
				}
			});
		})(i);
		seed.setTransform((i*132)+53, 630, 2, 2);
		stage.addChild(seed);
		messageField = new createjs.Text(inventory_arr[i].genotype, "bold 24px Arial", "#FFFFFF");
		messageField.x = ((i*132)+53);
		messageField.y = 674;
		stage.addChild(messageField);
		inventorySeeds.push(seed);
		messageFields.push(messageField);
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

			if (Math.abs((x+10) - seedCenterX) < 20 && Math.abs((y+20)  - seedCenterY) < 20) {
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
		stage.addChild(help1);
		stage.addChild(help2);
	}
	else{
		stage.removeChild(help_bg);
		stage.removeChild(help_display);
		stage.removeChild(help1);
		stage.removeChild(help2);
	}
}

function drawPunnett(punnettToggle){
	if (punnettToggle) {
		stage.addChild(punnett);
		var text = new createjs.Text("CROSS!", "bold 24px Arial", "#FFFFFF");
		text.x = 460;
		text.y = 325;
		var shape = new createjs.Shape();
		shape.graphics.beginFill("#5ab738").drawRect(455, 320, 100, 50);
		crossButton.push(shape);
		crossButton.push(text);
		stage.addChild(shape);
		stage.addChild(text);
		shape.addEventListener("click", function(){
			var topLeft = punnetText[0].text + punnetText[2].text;
			console.log(punnetText[2].text < punnetText[0].text);
			console.log(punnetText[2].text > punnetText[0].text);
			if(punnetText[2].text < punnetText[0].text) {
				topLeft = punnetText[2].text + punnetText[0].text;
			}

			var topRight = punnetText[0].text + punnetText[3].text;
			if(punnetText[3].text < punnetText[0].text) {
				topRight = punnetText[3].text + punnetText[0].text;
			}
			var bottomLeft = punnetText[1].text + punnetText[2].text;
			if(punnetText[2].text < punnetText[1].text) {
				bottomLeft = punnetText[2].text + punnetText[1].text;
			}
			var bottomRight = punnetText[1].text + punnetText[3].text;
			if(punnetText[3].text < punnetText[1].text) {
				bottomRight= punnetText[3].text + punnetText[1].text;
			}
			crossTypes(topLeft, 380, 220);
			crossTypes(topRight, 580, 220);
			crossTypes(bottomLeft, 380, 420);
			crossTypes(bottomRight, 580, 420);
			var rand = Math.random();
			var found = false;
			var text = "";
			var keys = Object.keys(probabilities);
			while (!found){
				var randIndex = Math.floor(Math.random()*keys.length);
				console.log(randIndex + " " + probabilities[keys[randIndex]]);
				if (rand <= probabilities[keys[randIndex]]/4 || probabilities[keys[randIndex]] == 4){
					found = true;
					text = keys[randIndex];
				}
				rand = Math.random();
			}
			var seed = new Seed(0, 0);
			seed.genotype = text;
			inventory_arr.push(seed);
			paintInventory();
			stage.removeChild(crossButton[0]);
			stage.removeChild(crossButton[1]);
			crossClicked = true;
		});
	}
	else {
		stage.removeChild(punnett);
		for (var i = 0; i < punnettImages.length; i++){
			stage.removeChild(punnettImages[i]);
		}
		for (var i = 0; i < punnetText.length; i++){
			stage.removeChild(punnetText[i]);
		}
		for (var i = 0; i < crossButton.length; i++) {
			stage.removeChild(crossButton[i]);
		}
		//images
		punnetText = [];
		punnettImages = [];
		crossButton = [];
		//actual objects
		punnettSeeds = [];
		probabilities = {};
		leftSide = false;
		crossClicked = false;
	}
}

function crossTypes(text, locX, locY){
	var text_type = new createjs.Text(text, "bold 36px Arial", "#000000");
	text_type.x = locX;
	text_type.y = locY;
	stage.addChild(text_type);
	crossButton.push(text_type);
	for (var i = 0; i < punnettSeeds.length; i++){
		console.log("looping");
		for (var j = 0; j < inventory_arr.length; j++){
			if (punnettSeeds[i] == inventory_arr[j]){
				stage.removeChild(inventorySeeds[j]);
				stage.removeChild(messageFields[j]);
				inventory_arr.splice(j, 1);
			}
		}
	}
	for (var i = 0; i < inventorySeeds.length; i++){
		stage.removeChild(inventorySeeds[i]);
	}
	for (var i = 0; i < messageFields.length; i++){
		stage.removeChild(messageFields[i]);
	}
	paintInventory();
	if (probabilities[text] == undefined){
		probabilities[text] = 1;
	}
	else {
		probabilities[text]++;
	}
}

function giveSeed(){
	for (var i = 0; i < npcs.length; i++){
		if (Math.abs((npcs[i].x - player.x)) <= 50 && Math.abs((npcs[i].y - player.y)) <= 50){
			for (var j = 0; j < inventory_arr.length; j++){
				console.log("inventory prints" + speechTexts[i].text + " " + inventory_arr[j].text);
				if (speechTexts[i].text === inventory_arr[j].genotype){
					for (var k = 0; k < inventorySeeds.length; k++){
						stage.removeChild(inventorySeeds[k]);
					}
					for (var k = 0; k < messageFields.length; k++){
						stage.removeChild(messageFields[k]);
					}
					inventory_arr.splice(j, 1);
					paintInventory();
					stage.removeChild(npcImages[i]);
					stage.removeChild(speechBubbles[i]);
					stage.removeChild(speechTexts[i]);
					npcs.splice(i, 1);
					npcImages.splice(i, 1);
					speechBubbles.splice(i, 1);
					speechTexts.splice(i, 1);
					numNpcs--;
					score += 10;
					updateScore();
				}
			}
		}
	}
}

function deleteSeed(keycode){
	var idx = keycode-49;
	if(idx < inventory_arr.length) {
		inventory_arr.splice(idx, 1);
		stage.removeChild(inventorySeeds[idx]);
		stage.removeChild(messageFields[idx]);
		inventorySeeds.splice(idx, 1);
		messageFields.splice(idx, 1);
		paintInventory();
	}
}

function endGame() {
	createjs.Ticker.removeAllEventListeners();
	stage.removeAllChildren();
	stage.update();
	if(!gameLost) {
		var result = new createjs.Text("gr8 job u R D b35t s33d l33t expert",
			"40px Arial", "#FFFFFF");
	}
	else{
		var result = new createjs.Text("Game Over (Your score reached 0!)",
			"40px Arial", "#FFFFFF");
	}
	result.x = canvas.width/2 - 200;
	result.y = canvas.height/2;
	stage.addChild(result);
}

function updateScore(){
	stage.removeChild(score_text);
	score_text = new createjs.Text("Score: \n" + "    " + score,
		"24px Arial", "#FFFFFF");
	score_text.x = 969;
	score_text.y = 60;
	stage.addChild(score_text);
}

function helpOnTop(){
	if(helpToggle) {
		stage.removeChild(help_bg);
		stage.removeChild(help_display);
		stage.removeChild(help1);
		stage.removeChild(help2);
		stage.addChild(help_bg);
		stage.addChild(help_display);
		stage.addChild(help1);
		stage.addChild(help2);
	}
}

function punnettOnTop(){
	if(punnettToggle) {
		stage.removeChild(punnett);
		for (var i = 0; i < punnettImages.length; i++) {
			stage.removeChild(punnettImages[i]);
		}
		for (var i = 0; i < punnetText.length; i++) {
			stage.removeChild(punnetText[i]);
		}
		for (var i = 0; i < crossButton.length; i++) {
			stage.removeChild(crossButton[i]);
		}
		stage.addChild(punnett);
		for (var i = 0; i < punnettImages.length; i++) {
			stage.addChild(punnettImages[i]);
		}
		for (var i = 0; i < punnetText.length; i++) {
			stage.addChild(punnetText[i]);
		}
		if (!crossClicked) {
			for (var i = 0; i < crossButton.length; i++) {
				stage.addChild(crossButton[i]);
			}
		}
		else {
			for (var i = 2; i < crossButton.length; i++) {
				stage.addChild(crossButton[i]);
			}
		}
	}
}

function updateStamina(){
	if(stamina > 0){
		noRun = false;
	}
	stage.removeChild(staminaShape);
	staminaShape = new createjs.Shape();
	staminaShape.graphics.beginStroke("#000");
	staminaShape.graphics.setStrokeStyle(1);
	staminaShape.snapToPixel = true;
	staminaShape.graphics.beginFill("#FFA500").drawRect(977, 150, 50, stamina);
	stage.addChild(staminaShape);
}