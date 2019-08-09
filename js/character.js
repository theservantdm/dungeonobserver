/*
Dungeon Observer JavaScript
Created: 30/12/2018
Updated: 12/06/2019
By:Derek Gilmore
Twitter: @TheServantDM

This file contains the code for the character generation and display
*/

// this function responds to the observer button press
function ObserverButton() {
	clearTimeout(nextRound);
	clearTimeout(roundProgress);
	RoundTimer();
}

// this function responds to the zoom button press
function ZoomButton() {
	if(gridZoom == 10) {
		gridZoom = 3;
	}
	else {
		gridZoom = 10;
		UpdateGraphicsZoomMap();
	}
	UpdateTileMap();
	UpdateNoteGrid();
}

// this function responds to the test button press
function TestButton() {
	console.log(gridArr);
}

// sets the OPC object
OPC = {
	name: "",
	personality: "",
	experience: 0,
	race: "",
	size: "",
	class: "",
	level: 1,
	build: "",
	AC: 10,
	hpMax: 0,
	hpCurrent: 0,
	state: "conscious",
	deathSaveSuccess: 0,
	deathSaveFail: 0,
	speed: 0,
	proficiencyBonus: 2,
	abilityScores: [],
	hdValue: 0,
	hdRemaining: 1,
	savingThrows: [],
	CFfightingStyle: [],
	CFSecondWind: 0,
	skills: [],
	senses: [],
	languages: [],
	mainHand: "",
	attackBonus: 0,
	damageDice: [],
	damageType: "",
	damageBonus: 0,
	offHand: "",
	armor: "",
	backpack: [leather,dagger,rations,rations,rations,rations,rations,torch,torch,torch,torch,torch],
	copper: 10,
	encumberance: 0,
	light: 0,
	lightLoc: "",
	lightLife: 0,
	encumberanceMax: 0,
	currentPos: -1,
	lastPos: -1,
	goal: "travel",
	encounter: "",
};

// this function generates a random name for the OPC
function NameGenerator() {
	var vowel = ["a","e","i","o","u"]; // vowel[Dice(vowel.length)-1];
	var diphthong = ["ai","au","ay","ea","ee","ie","oa","oi","oo","ou","ui","y"]; // diphthong[Dice(diphthong.length)-1];
	var consonant = ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z"]; // consonant[Dice(consonant.length)-1];
	var digraph = ["bl","br","ch","cl","cr","dr","fl","fr","gl","gr","ph","pl","pr","qu","sc","sh","sk","sl","sm","sn","sp","st","sw","th","tr","tw","wh","wr"]; // digraph[Dice(digraph.length)-1];
	var firstSound = "";
	var secondSound = "";
	var thirdSound = "";
	var fourthSound = "";
	var fifthSound = "";
	var sixthSound = "";
	switch(Dice(2)) { // generate the first sound (vowel)
		case 1:
			firstSound = "";
		break;
		default:
			firstSound = vowel[Dice(vowel.length)-1];
		break;
	}
	switch(Dice(3)) { // generate the second sound (consonant)
		case 1:
			secondSound = digraph[Dice(digraph.length)-1];
		break;
		default:
			secondSound = consonant[Dice(consonant.length)-1];
		break;
	}
	switch(Dice(6)) { // generate the third sound (vowel)
		case 1:
			thirdSound = diphthong[Dice(diphthong.length)-1];
		break;
		default:
			thirdSound = vowel[Dice(vowel.length)-1];
		break;
	}
	switch(Dice(4)) { // generate the sixth sound (consonant + vowel)
		case 1:
			fourthSound = digraph[Dice(digraph.length)-1] + vowel[Dice(vowel.length)-1];
		break;
		default:
			fifthSound = consonant[Dice(consonant.length)-1];
			switch(Dice(2)) { // generate the seventh sound
			case 1:
				sixthSound = "";
			break;
			case 2:
				sixthSound = vowel[Dice(vowel.length)-1];
			break;
			}
		break;
	}
	var allSounds = firstSound + secondSound + thirdSound + fourthSound + fifthSound + sixthSound; // combine the random sounds
	OPC.name = allSounds.substr(0,1).toUpperCase() + allSounds.substr(-(allSounds.length-1)); // make the first letter upper case
}

// this function randomly determines personality
function AssignPersonality() {
	switch(Dice(1)) {
		default:
			OPC.personality = "balanced";
			break;
	}	
}

// this function randomly determines build
function AssignBuild() {
	switch(2) { // Dice(5)) {
		case 1:
			OPC.build = "archer";
			break;
		case 2:
			OPC.build = "footman";
			break;
		case 3:
			OPC.build = "duelist";
			break;
		case 4:
			OPC.build = "brute";
			break;
		case 5:
			OPC.build = "dervish";
			break;
	}	
}

// this function generates random ability scores for the OPC
//var abilityScores;
function AbiltyScores() {
	var rolls = [FourDieSix(),FourDieSix(),FourDieSix(),FourDieSix(),FourDieSix(),FourDieSix()];
	switch(OPC.build) {
		case "archer":
			var abilityPriority = [3,6,4,2,5,1];
			break;
		case "footman":
			var abilityPriority = [6,3,5,1,4,2];
			break;
		case "duelist":
			var abilityPriority = [2,6,4,3,1,5];
			break;
		case "brute":
			var abilityPriority = [6,4,5,1,2,3];
			break;
		case "dervish":
			var abilityPriority = [3,6,5,2,4,1];
			break;
		default:
			abilityPriority = [1,1,1,1,1,1];
			break;
	}
	for(var i = 0; i < 6; i++) {
		OPC.abilityScores[ArrayFindPositionHighest(abilityPriority)] = rolls[ArrayFindPositionHighest(rolls)];
		rolls[ArrayFindPositionHighest(rolls)] = 0;
		abilityPriority[ArrayFindPositionHighest(abilityPriority)] = 0;
	}
}

// this function randomly determines race
function AssignRace() {
	switch(Dice(1)) {
		default:
			OPC.race = "human";
			break;
	}
}

// this function applies the racial attributes to the OPC
function RacialAttributes(raceOPC) {
	switch(OPC.race){
	case "human":
		for(var i = 0; i < OPC.abilityScores.length; i++) {
			OPC.abilityScores[i]++;
		}
		OPC.speed = 30;
		OPC.size = "medium"
		var languages = ["dwarvish","elvish","giant","gnomish","goblin","halfling","orc"];
		var known = languages[Dice(languages.length)-1];
		OPC.languages = ["common", known]
	}
}

// this function randomly determines class
function AssignClass() {
	switch(Dice(1)) {
		default:
			OPC.class = "fighter";
			break;
	}
}

// this function applies the class attributes to the OPC
function ClassAttributes(classOPC) {
	/*
	Hit Dice & HP
	Proficiencies
		armor light/medium/heavy
		weapons simple/martial/individual
		tools
		saving throws
		skills (choose from list based on ability strengths)
	class features
		fighting style
		second wind
	*/
	switch(classOPC) {
		case "fighter":
			OPC.hpMax = 10 + Math.floor(OPC.abilityScores[2]/2)-5;
			OPC.hpCurrent = OPC.hpMax;
			OPC.hdValue = 10;
			OPC.savingThrows = ["strength","constitution"]; // Str, Dex, Con, Int, Wis, Cha
			switch(OPC.personality) {
				default:
					OPC.skills = []; // acrobatics,	animal	handling, athletics, history, insight, intimidation, perception, survival
			}
			switch(OPC.build) {
				case "archer":
				OPC.skills = ["acrobatics", "perception", "survival"];
				OPC.CFfightingStyle = [1,0,0,0,0];
				break;
			case "footman":
				OPC.skills = ["animal handling", "athletics", "survival"];
				OPC.CFfightingStyle = [0,1,0,0,0];
				break;
			case "duelist":
				OPC.skills = ["acrobatics", "history", "intimidation"];
				OPC.CFfightingStyle = [0,0,1,0,0];
				break;
			case "brute":
				OPC.skills = ["acrobatics", "athletics", "intimidation"];
				OPC.CFfightingStyle = [0,0,0,1,0];
				break;
			case "dervish":
				OPC.skills = ["acrobatics", "athletics", "perception"];
				OPC.CFfightingStyle = [0,0,0,0,1];
				break;
			}
			OPC.CFSecondWind = 1;
	}
}

// this function calculates the AC of the OPC
function CalculateAC(armor = OPC.armor) {
	baseAC = 10;
	if(Array.isArray(armor)) {
		baseAC = armor[2];
	}
	dexMod = Math.floor(OPC.abilityScores[1]/2)-5;
	switch(armor[3]) {
		case 0:
			dexMod = 0;
			break;
		default:
			if(Array.isArray(armor)) {
				dexMod = Math.min(dexMod, armor[3]);
			}
			break;
	}
	armorClass = baseAC + dexMod;
	if(OPC.offHand[0] == "s"){
		armorClass += OPC.offHand[2];
	}
	return armorClass;
}

// this function determines the damage dice of the weapon(s) and returns the array
function SetDamageDice(weapon = OPC.mainHand) {
	diceDamageArray = [4,1]; // for all non-weapon class items (improvised weapons)
	if(weapon[0] == "w") { // is a weapon class item
		diceDamageArray = weapon[2];
	}
	return diceDamageArray;
}

// this function determines the damage type of the weapon(s) and returns the text string
function SetDamageType(weapon = OPC.mainHand) {
	damageTypeText = "bludgeoning"; // for all non-weapon class items (improvised weapons)
	if(weapon[0] == "w") { // is a weapon class item
		damageTypeText = weapon[3];
	}
	return damageTypeText;
}

// this function calculates the attack bonus for the OPC
function CalculateAttackBonus(weapon = OPC.mainHand) {
	attackBonus = 0;
	hasFinesse = 0;
	if(weapon[0] = "w") { // if this is a weapon class item
		for(iAB = 0; iAB < weapon[4].length; iAB ++) { // I think there's an easier way to do this using an array method //////////////////////
			if(weapon[4][iAB] == "finesse") { // weaopn has finesse property
				hasFinesse = 1;
				break;
			}
		}
		// replace with array.includes("finesse");
		if(hasFinesse > 0) { // weaopn has finesse property, take better between str and dex
			attackBonus += Math.floor(Math.max(OPC.abilityScores[0],OPC.abilityScores[1])/2)-5;
		}
		else { // add str mod
			attackBonus += Math.floor(OPC.abilityScores[0]/2)-5;
		}
	}
	else { // for all non-weapon classed items
		attackBonus += Math.floor(OPC.abilityScores[0]/2)-5;
	}
	attackBonus += OPC.proficiencyBonus;
	return attackBonus;
}

// this function calculates the damage bonus for the OPC
function CalculateDamageBonus(weapon = OPC.mainHand) {
	damageBonus = 0;
	hasFinesse = 0;
	for(iAB = 0; iAB < weapon[4].length; iAB ++) {
		if(weapon[4][iAB] == "finesse") { // weaopn has finesse property
			hasFinesse = 1;
			break;
		}
	}
	if(hasFinesse > 0) { // weaopn has finesse property, take better between str and dex
		damageBonus += Math.floor(Math.max(OPC.abilityScores[0],OPC.abilityScores[1])/2)-5;
	}
	else { // add str mod
		damageBonus += Math.floor(OPC.abilityScores[0]/2)-5;
	}
	return damageBonus;
}

// this function calculates the encumberance for the OPC
function CalculateEncumberance() { // STR * 5, * 10
	OPC.encumberanceMax = OPC.abilityScores[0] * 10;
	OPC.encumberance = 0;
// equipped gear
	switch(OPC.mainHand[0]) { // whatever is in the main hand
		case "a":
			OPC.encumberance += OPC.mainHand[6];
			break;
		case "l":
		case "s":
			OPC.encumberance += OPC.mainHand[3];
			break;
		case "m":
			OPC.encumberance += OPC.mainHand[2];
			break;
		case "w":
			OPC.encumberance += OPC.mainHand[5];
			break;
	}
	switch(OPC.offHand[0]) { // whatever is in the off hand
		case "a":
			OPC.encumberance += OPC.offHand[6];
			break;
		case "l":
		case "s":
			OPC.encumberance += OPC.offHand[3];
			break;
		case "m":
			OPC.encumberance += OPC.offHand[2];
			break;
		case "w":
			OPC.encumberance += OPC.offHand[5];
			break;
	}
	switch(OPC.armor[0]) { // whatever is armor
		case "a":
			OPC.encumberance += OPC.armor[6];
			break;
		case "l":
		case "s":
			OPC.encumberance += OPC.armor[3];
			break;
		case "m":
			OPC.encumberance += OPC.armor[2];
			break;
		case "w":
			OPC.encumberance += OPC.armor[5];
			break;
	}
// backpack
	for(iE = 0; iE < OPC.backpack.length; iE++) { // go through all contents of the backpack
		switch(OPC.backpack[iE][0]){
			case "a":
				OPC.encumberance += OPC.backpack[iE][6];
				break;
			case "l":
			case "s":
				OPC.encumberance += OPC.backpack[iE][3];
				break;
			case "m":
				OPC.encumberance += OPC.backpack[iE][2];
				break;
			case "w":
				OPC.encumberance += OPC.backpack[iE][5];
				break;			
		}
	}
// coins
	cp = OPC.copper;
	pp = Math.floor(cp / 1000);
	cp -= pp * 1000;
	gp = Math.floor(cp / 100);
	cp -= gp * 100;
	sp = Math.floor(cp / 10);
	cp -= sp * 10;
	OPC.encumberance += Math.ceil((cp + sp + gp + pp) / 50);
}

// this function writes the character information to the page
function WriteOPC() {
	document.getElementById("opc-name").innerHTML=OPC.name;
	document.getElementById("opc-description").innerHTML=OPC.personality + ", "+ OPC.race + " (" + OPC.size + "), " + OPC.class + "-" + OPC.build;
	document.getElementById("opc-xp").innerHTML="XP: " + OPC.experience;
	document.getElementById("opc-ac").innerHTML='AC ' + OPC.AC;
	document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax + " - HD: " + OPC.hdRemaining;
	document.getElementById("opc-speed").innerHTML='Sp ' + OPC.speed;
	document.getElementById("ability-str").innerHTML='STR<br>' + OPC.abilityScores[0];
	document.getElementById("ability-dex").innerHTML='DEX<br>' + OPC.abilityScores[1];
	document.getElementById("ability-con").innerHTML='CON<br>' + OPC.abilityScores[2];
	document.getElementById("ability-int").innerHTML='INT<br>' + OPC.abilityScores[3];
	document.getElementById("ability-wis").innerHTML='WIS<br>' + OPC.abilityScores[4];
	document.getElementById("ability-cha").innerHTML='CHA<br>' + OPC.abilityScores[5];
	document.getElementById("opc-saves").innerHTML='Saving Throws: ' + OPC.savingThrows[0] + ", " + OPC.savingThrows[1];
	document.getElementById("opc-skills").innerHTML='Skills: ' + OPC.skills[0] + ", " + OPC.skills[1] + ", " + OPC.skills[2];
	document.getElementById("opc-languages").innerHTML='Languages: ' + OPC.languages[0] + ", " + OPC.languages[1];
	document.getElementById("opc-encumberance").innerHTML=OPC.encumberance + " / " + OPC.encumberanceMax;
	document.getElementById("opc-main-hand").innerHTML="Main hand: " + OPC.mainHand[1];
	document.getElementById("opc-off-hand").innerHTML="Off Hand: " + OPC.offHand[1];
	document.getElementById("opc-armor").innerHTML="Armor: " + OPC.armor[1];
	cp = OPC.copper;
	pp = Math.floor(cp / 1000);
	cp -= pp * 1000;
	gp = Math.floor(cp / 100);
	cp -= gp * 100;
	sp = Math.floor(cp / 10);
	cp -= sp * 10;
	document.getElementById("opc-coin").innerHTML="pp: " + pp + " / gp: " + gp + " / sp: " + sp + " / cp: " + cp;
	document.getElementById("opc-goal").innerHTML="G:" + OPC.goal + ", E:" + OPC.encounter  + ", S:" + OPC.state;
	items = "";
	for(iBP = 0; iBP < OPC.backpack.length; iBP ++) {
		if(items != "") {
			items += ", ";
		}
		items += OPC.backpack[iBP][1];	
	}
	document.getElementById("opc-items").innerHTML="Backpack: " + items;
//	document.getElementById("opc-light").innerHTML="Light Life: " + OPC.lightLife;
	if(OPC.lightLoc == "offHand") {
		switch(OPC.offHand) {
			case torch:
				lightLifeBar = OPC.lightLife / 6;
				break;
			case lantern:
				lightLifeBar = OPC.lightLife / 36;			
				break;
			default:
				lightLifeBar = 100;
				break;
		}
	}
	document.getElementById("light-life-bar").style.width = lightLifeBar + "%";
	document.getElementById("light-life-bar").style.backgroundColor = "rgba(255," + lightLifeBar * 2.55 + ",0,1)";
}

// this function creates the OPC
function GenerateCharacter() {
	NameGenerator();
	AssignPersonality();
	AssignBuild();
	AbiltyScores();
	AssignRace();
	RacialAttributes(OPC.race);
	AssignClass();
	ClassAttributes(OPC.class);
	EquipBest();
	CalculateEncumberance();
	WriteOPC();
}