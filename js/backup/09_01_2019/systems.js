/*
Dungeon Observer JavaScript
Created: 30/12/2018
Updated: 07/01/2019
By:Derek Gilmore
Twitter: @TheServantDM

This file contains the code for the game systems
*/

/*
OPC RELATED FUNCTIONS
OPC RELATED FUNCTIONS
OPC RELATED FUNCTIONS
*/

// this function responds to the observer button press
function ObserverButton() {
	console.log("ObBut pressed");
	clearTimeout(nextRound);
	RoundTimer();
};

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
	mainHand: shortSword,
	attackBonus: 0,
	damageBonus: 0,
	offHand: torch,
	armor: leather,
	currentPos: -1,
	lastPos: -1,
	goal: "travel"
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
};

// this function randomly determines personality
function AssignPersonality() {
	switch(Dice(1)) {
		default:
			OPC.personality = "balanced";
			break;
	}	
};

// this function randomly determines build
function AssignBuild() {
	switch(Dice(5)) {
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
};

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
};

// this function randomly determines race
function AssignRace() {
	switch(Dice(1)) {
		default:
			OPC.race = "human";
			break;
	}
};

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
};

// this function randomly determines class
function AssignClass() {
	switch(Dice(1)) {
		default:
			OPC.class = "fighter";
			break;
	}
};

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
				OPC.skills = ["animal	handling", "athletics", "survival"];
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
};

// this function calulates the AC of the OPC
function CalculateAC() {
	baseAC = 10;
	if(OPC.armor[0] != "") {
		baseAC = OPC.armor[2];
	}
	dexMod = Math.min(Math.floor(OPC.abilityScores[1]/2)-5, OPC.armor[3]); // this will need to be updated for heavy armor with no dex mod
	armorClass = baseAC + dexMod;
	if(OPC.offHand[0] == "shield"){
		armorClass += OPC.offHand[1];
	}
	OPC.AC = armorClass;
};

// this function calculates the attack bonus for the OPC
function CalculateAttackBonus() {
	attackBonus = 0;
	hasFinesse = 0;
	for(iAB = 0; iAB < OPC.mainHand[4].length; iAB ++) {
		if(OPC.mainHand[4][iAB] == "finesse") { // weaopn has finesse property
			hasFinesse = 1;
			break;
		}
	}
	if(hasFinesse > 0) { // weaopn has finesse property, take better between str and dex
		attackBonus += Math.floor(Math.max(OPC.abilityScores[0],OPC.abilityScores[1])/2)-5;
	}
	else { // add str mod
		attackBonus += Math.floor(OPC.abilityScores[0]/2)-5;
	}
	attackBonus += OPC.proficiencyBonus;
	OPC.attackBonus = attackBonus;
};

// this function calculates the damage bonus for the OPC
function CalculateDamageBonus() {
	damageBonus = 0;
	hasFinesse = 0;
	for(iAB = 0; iAB < OPC.mainHand[4].length; iAB ++) {
		if(OPC.mainHand[4][iAB] == "finesse") { // weaopn has finesse property
			hasFinesse = 1;
			break;
		}
	}
	if(hasFinesse > 0) { // weaopn has finesse property, take better between str and dex
		damageBonus += Math.floor(Math.max(OPC.abilityScores[0],OPC.abilityScores[1])/2)-5;
	}
	else { // add str mod
		attackBonus += Math.floor(OPC.abilityScores[0]/2)-5;
	}
	OPC.damageBonus = damageBonus;
};

// this function writes the character information to the page
function WriteOPC() {
	document.getElementById("opc-name").innerHTML=OPC.name;
	document.getElementById("opc-description").innerHTML=OPC.personality + ", "+ OPC.race + " (" + OPC.size + "), " + OPC.class + "-" + OPC.build;
	document.getElementById("opc-xp").innerHTML="XP: " + OPC.experience;
	document.getElementById("opc-ac").innerHTML='AC ' + OPC.AC;
	document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax;
	document.getElementById("opc-speed").innerHTML='Sp ' + OPC.speed;
	document.getElementById("ability-str").innerHTML='STR ' + OPC.abilityScores[0];
	document.getElementById("ability-dex").innerHTML='DEX ' + OPC.abilityScores[1];
	document.getElementById("ability-con").innerHTML='CON ' + OPC.abilityScores[2];
	document.getElementById("ability-int").innerHTML='INT ' + OPC.abilityScores[3];
	document.getElementById("ability-wis").innerHTML='WIS ' + OPC.abilityScores[4];
	document.getElementById("ability-cha").innerHTML='CHA ' + OPC.abilityScores[5];
	document.getElementById("opc-saves").innerHTML='Saving Throws: ' + OPC.savingThrows[0] + ", " + OPC.savingThrows[1];
	document.getElementById("opc-skills").innerHTML='Skills: ' + OPC.skills[0] + ", " + OPC.skills[1] + ", " + OPC.skills[0];
	document.getElementById("opc-languages").innerHTML='Languages: ' + OPC.languages[0] + ", " + OPC.languages[1];
};

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
	CalculateAC();
	CalculateAttackBonus();
	CalculateDamageBonus();
	WriteOPC();
};

// this function will move the OPC through the dungeon using the "left hand rule"
function TravelLHR() {
	if(OPC.currentPos == -1) {
		for(var i = 0; i < gridArr.length; i++) { // find and store the start position
			if(gridArr[i].room == "ST"){
				OPC.currentPos = i;
				OPC.lastPos = i - 10;
				break;
			}
		}
		UpdateTileMap();
		return;
	}
	if (gridArr[OPC.currentPos].room == "ST") { // check to see if it's time to exit the dungeon
		openCounter = 0; // open amount on map
		for(i = 0; i < gridArr.length; i++) {
			if(gridArr[i].open > 0) {
				openCounter ++;
			}
		}
		exploredCounter = 0; // explored amount on map
		for(i = 0; i < gridArr.length; i++) {
			if(gridArr[i].explored > 0) {
				exploredCounter ++;
			}
		}
		if(exploredCounter/openCounter > 0.5) { // if mostly explored, create a new dungeon
			CreateTileGrid();
			CreateGraphicsGrid();
			CreateMapArray();
			PopulateMapRooms();
			PopulateMapTunnels();
			PopulateRandomTunnels();
			PopulateSecretRoom();
			AddEncounters();
			UpdateGraphicsMap();
			for(var i = 0; i < gridArr.length; i++) { // find and store the start position
				if(gridArr[i].room == "ST"){
					OPC.currentPos = i;
					OPC.lastPos = i - 10;
					break;
				}
			}
			UpdateTileMap();
			LongRest();
			return;
		}
	}
	directionPriority = 0; // determine which was to go based on the left hand rule
	if(OPC.lastPos == OPC.currentPos - 1) {
		directionPriority = 1;
	}
	else if(OPC.lastPos == OPC.currentPos + 1) {
		directionPriority = 3;
	}
	else if(OPC.lastPos == OPC.currentPos - 10) {
		directionPriority = 2;
	}
	else if(OPC.lastPos == OPC.currentPos + 10) {
		directionPriority = 4;
	}
	nextMove = -1;
	while(nextMove == -1) {
		switch(directionPriority){
			case 1:
				targetPos = OPC.currentPos - 10;
				break;
			case 2:
				targetPos = OPC.currentPos + 1;
				break;
			case 3:
				targetPos = OPC.currentPos + 10;
				break;
			case 4:
				targetPos = OPC.currentPos - 1;
				break;
		}
		targetValid = 0;
		switch(Math.abs(OPC.currentPos - targetPos)) { // determine between west-east and north-south moves
			case 1: // west-east
				if(Math.floor(targetPos / 10) == Math.floor(OPC.currentPos / 10)) { // valid
					targetValid = 1;
				}
				break;
			case 10: // north-south
				if(targetPos >= 0 && targetPos <= 99) { // valid
					targetValid = 1;
				}
				break;
		};
		if(targetValid == 1 && // is a valid space on the grid 
		gridArr[targetPos].open > 0) { // is an open area
			if(gridArr[OPC.currentPos].room == "SC") { // OPC is in a secret room
				if(gridArr[OPC.currentPos].exit == targetPos) { // target position has the secret door
					nextMove = targetPos;
				}
			}
			else if(gridArr[targetPos].room != "SC") { // target is not a secret room
				nextMove = targetPos;
			}
			else if(gridArr[targetPos].room == "SC" && // target is a secrect room
			OPC.currentPos == gridArr[targetPos].exit && // current is the secret door for the target secret room
			gridArr[OPC.currentPos].sDoor == 1) { // OPC is at the closed secrect door
				document.getElementById("opc-feedback").innerHTML="Hmm...";
				OPC.goal = "investigate";
				UpdateTileMap();
				return;
			}
			else if(gridArr[targetPos].room == "SC" && // target is a secrect room
			OPC.currentPos == gridArr[targetPos].exit && // current is the secret door for the target secret room
			gridArr[OPC.currentPos].sDoor == 3) { // OPC is at the open secrect door
				UpdateTileMap();
				nextMove = targetPos;
			}
		}
		directionPriority ++;
		if(directionPriority > 4) {
			directionPriority = 1;
		}
	}
	if(gridArr[nextMove].encounter == "combat"){ // switch from travel to combat
		OPC.goal = "combat";
		combatRounds = 0;
	}
	OPC.lastPos = OPC.currentPos;
	OPC.currentPos = nextMove;
	gridArr[OPC.currentPos].explored ++;
	UpdateTileMap();
};

// this function will investigate the area the OPC is in and deliver an outcome
function Investigate() {
	secretDC = 10;
	switch(gridArr[OPC.currentPos].sDoor) {
		case 1:
			gridArr[OPC.currentPos].sDoor = 2;
			roll = Dice(20);
			rollBonus = Math.floor(OPC.abilityScores[4]/2)-5; // add Wisdom modifier
			for(i = 0; i < OPC.skills.length; i++) { // look at all skills
				if(OPC.skills[i] == "perception") { //check to see if perception is a skill
					rollBonus += OPC.proficiencyBonus; // add proficiency bonus
					break;
				}
			}
			feedback = "Wisdom (Perception): " + roll + " + " + rollBonus + " = " + (roll + rollBonus) + "<br>";
			if(roll + rollBonus >= secretDC) { // make an wisdom perception check to see if you notice the secret door
				feedback += "This looks like it could be something...";
			}
			else {
				feedback += "*shrug*";
				OPC.goal = "travel";
			}
			document.getElementById("opc-feedback").innerHTML=feedback;
			break;
		case 2:
			roll = Dice(20);
			rollBonus = Math.floor(OPC.abilityScores[3]/2)-5; // add Intelligence modifier
			for(i = 0; i < OPC.skills.length; i++) { // look at all skills
				if(OPC.skills[i] == "Investigation") { //check to see if investigation is a skill
					rollBonus += OPC.proficiencyBonus; // add proficiency bonus
					break;
				}
			}
			feedback = "Intelligence (investigation): " + roll + " + " + rollBonus + " = " + (roll + rollBonus) + "<br>";
			if(roll + rollBonus >= secretDC) { // make an intelligence investigation check to see if you open the secret door
				feedback += "This should do it...";
				gridArr[OPC.currentPos].sDoor = 3;
			}
			else {
				feedback += "... I have no idea.";
			}
			OPC.goal = "travel";
			document.getElementById("opc-feedback").innerHTML=feedback;
			break;
	}
};

var combatStage = 0;
// this function will resolve combat
function Combat() {
	switch(combatStage){
		case 0:
			NPC = BatsAndRats();
			NPC.hpCurrent = NPC.hpMax;
			combatStage ++;
			document.getElementById("opc-feedback").innerHTML=OPC.name + "has entered combat with a " + NPC.name + "!";
			return;
		case 1:
			document.getElementById("npc-name").innerHTML=NPC.name;
			document.getElementById("npc-hp").innerHTML="HP: " + NPC.hpCurrent;
			if(OPC.state == "conscious"){ // OPC is conscious, determine initiative
				rollOPC = Dice(20);
				rollBonusOPC = Math.floor(OPC.abilityScores[1]/2)-5;
				totalOPC = rollOPC + rollBonusOPC;
				rollNPC = 1;//Dice(20);
				rollBonusNPC = Math.floor(NPC.abilityScores[1]/2)-5;
				totalNPC = rollNPC + rollBonusNPC;
				feedback = OPC.name + " initiative: " + rollOPC + " + " + rollBonusOPC + " = " + (totalOPC) + "<br>" + NPC.name + " initiative: " + rollNPC + " + " + rollBonusNPC + " = " + (totalNPC);
				turnOrder = 0;
				if(totalOPC > totalNPC) { // determine turn order based on initiative rolls
					turnOrder = 1;
					feedback += "<br>" + OPC.name + " goes first!";
				}
				else if(totalOPC < totalNPC) {
					turnOrder = 2;
					feedback += "<br>" + NPC.name + " goes first!";
				}
				else { // determine turn order based on dexterity scores
					if(OPC.abilityScores[1] > NPC.abilityScores[1]) {
						turnOrder = 1;
						feedback += "<br>" + OPC.name + " goes first!";
					}
					else if(OPC.abilityScores[1] < NPC.abilityScores[1]) {
						turnOrder = 2;
						feedback += "<br>" + NPC.name + " goes first!";
					}
					else { // randomly decide turn order
						if(Dice(2) > 1) {
							turnOrder = 1;
							feedback += "<br>" + OPC.name + " goes first!";
						}
						else {
							turnOrder = 2;
							feedback += "<br>" + NPC.name + " goes first!";
						}
					}
				}
			}
			else { // OPC is unconscious or stable, NPC goes first
				turnOrder = 2;
				feedback += "<br>" + NPC.name + " goes first!";
			}
			feedback += "<br>"; // add a line of space for ease of reading
			for(turn = 0; turn < 2; turn) {
				switch(turnOrder) {
					case 1: // OPC turn
						if(OPC.state == "conscious") {
							feedback += "<br>" + OPC.name + " attacks with " + OPC.mainHand[1];
							attackRollOPC = Dice(20);
							attackTotalOPC = attackRollOPC + OPC.attackBonus;
							feedback += "<br> Attack: " + attackRollOPC + " + " + OPC.attackBonus + " = " + attackTotalOPC;
							if(attackRollOPC == 1) { // is a critical miss
								feedback += "<br>It misses horribly!";
							}
							else if(attackTotalOPC < NPC.AC) { // miss
								feedback += "<br>It misses!";
							}
							else if(attackTotalOPC >= NPC.AC || // hit
							attackRollOPC == 20) { // or critical hit
								if(attackRollOPC == 20) { // critical hit!
									damageDealtOPC = Dice(OPC.mainHand[2]) + Dice(OPC.mainHand[2]) + OPC.damageBonus;
									feedback += "<br>It hits critically for "
								}
								else {
									damageDealtOPC = Dice(OPC.mainHand[2]) + OPC.damageBonus;
									feedback += "<br>It hits for "
								}
								feedback += damageDealtOPC + " " + OPC.mainHand[3] +" damage!";
								for(iDR = 0; iDR < NPC.damageRes.length; iDR ++) {
									if(NPC.damageRes[iDR] == "piercing") {
										damageResistedNPC = Math.ceil(damageDealtOPC/2);
										damageDealtOPC -= damageResistedNPC;
										feedback += "<br>But the " + NPC.name + " resisted " + damageResistedNPC + " of it.";
										break;
									}
								}
								NPC.hpCurrent -= damageDealtOPC;
								document.getElementById("npc-hp").innerHTML="HP: " + NPC.hpCurrent;
								if(NPC.hpCurrent < 1) {
									feedback += "<br>" + NPC.name + " was slain!";
									document.getElementById("opc-feedback").innerHTML=feedback;
									OPC.experience += Math.max(200 * NPC.CR, 10);
									document.getElementById("opc-xp").innerHTML="XP: " + OPC.experience;
									OPC.goal = "travel";
									gridArr[OPC.currentPos].encounter = "";
									combatStage = 0;
									return;
								}
							}
						}
						else if(OPC.state == "unconscious") {
							deathRollOPC = Dice(20); // roll death save
							if(deathRollOPC >= 10) { // success								
								switch(deathRollOPC) {
									case 20:
										OPC.hpCurrent = 1;
										document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax;
										OPC.state = "conscious";
										feedback += "<br>" + OPC.name + " recovers!";
										OPC.deathSaveSuccess = 0;
										OPC.deathSaveFail = 0;
										break;
									default:
										OPC.deathSaveSuccess ++;
										feedback += "<br>" + OPC.name + " passes death save!";
										break;
								}
							}
							else {
								switch(deathRollOPC) {
									case 1:
										OPC.deathSaveFail += 2;
										feedback += "<br>" + OPC.name + " critically fails a death save.";
										break;
									default:
										OPC.deathSaveFail ++;
										feedback += "<br>" + OPC.name + " fails a death save.";
										break;
								}
							}
							feedback += "<br>S: " + OPC.deathSaveSuccess + "<br>F: " + OPC.deathSaveFail;
							if(OPC.deathSaveSuccess >= 3) {
								OPC.state = "stable";
								OPC.deathSaveSuccess = 0;
								OPC.deathSaveFail = 0;
								OPC.goal = "short rest";
								combatStage = 0;
							}
							else if(OPC.deathSaveFail >= 3) {
								OPC.state = "dead";
								OPC.goal = "none";
								OPC.deathSaveSuccess = 0;
								OPC.deathSaveFail = 0;
								combatStage = 0;
							}
						}
						turn ++;
						feedback += "<br>";
						break;
					case 2: // NPC turn
						// movement?
						if(OPC.state == "conscious") {
							feedback += "<br>" + NPC.name + " uses " + NPC.actions.attack[0]; // declare attack
							attackRollNPC = Dice(20); // roll for attack
							attackTotalNPC = attackRollNPC + NPC.actions.attack[1]; // attack roll + attack bonus
							feedback += "<br> Attack: " + attackRollNPC + " + " + NPC.actions.attack[1] + " = " + attackTotalNPC;
							if(attackTotalNPC == 1) { // is a critical miss
								feedback += "<br>It misses horribly!";
							}
							else if(attackTotalNPC < OPC.AC) { // miss
								feedback += "<br>It misses!";
							}
							else if(attackTotalNPC >= OPC.AC || // hit
							attackRollNPC == 20) { // or critical hit
								if(attackRollNPC == 20) { // critical hit!
									damageDealtNPC = Dice(NPC.actions.attack[3][0],NPC.actions.attack[3][1]) + Dice(NPC.actions.attack[3][0],NPC.actions.attack[3][1]) + NPC.actions.attack[4];
									feedback += "<br>It hits critically for "
								}

								else {
									damageDealtNPC = Dice(NPC.actions.attack[3][0],NPC.actions.attack[3][1]) + NPC.actions.attack[4];
									feedback += "<br>It hits for "
								}
								feedback += damageDealtNPC + " " + NPC.actions.attack[5] + " damage!";
								OPC.hpCurrent -= damageDealtNPC;
								if(OPC.hpCurrent < 1) {
									if(OPC.hpCurrent <= OPC.hpMax * -1) {
										OPC.state = "dead";
										OPC.goal = "none";	
										combatStage = 0;
									}
									else {
										OPC.hpCurrent = 0;
										OPC.state = "unconscious";
									}
								}
								document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax;
							}
							else { // miss
								feedback += "<br>It misses!";
							}
						}
						else {
							feedback += "<br>" +  NPC.name + " ignores the unconscious " + OPC.name + ".";
						}
						turn ++;
						feedback += "<br>";
						break;
					default: // this should never happen...					
						turn ++;
						break;
				}
				turnOrder ++;
				if (turnOrder > 2) {
					turnOrder = 1;
				}
			}
			document.getElementById("opc-feedback").innerHTML=feedback;
			feedback = "";
			break;
	}
};

/*
elements of a round of combat
initiative (each round)
turn 1st
	movement
	action
	bonus action
turn 2nd
	movement
	action
	bonus action
*/

// this function will heal OPC by the value of 1 hit dice + Con mod (to be expanded later)
function ShortRest() {
	document.getElementById("opc-feedback").innerHTML="An hour passes...";
	while(OPC.hpCurrent < OPC.hpMax - (OPC.hdValue / 2) - (Math.floor(OPC.abilityScores[2]/2)-5)) { // spend hit dice if missing hp = 1/2 hit dice value + con mod
		for(OPC.hdRemaining; OPC.hdRemaining > 0; OPC.hdRemaining --) {
			OPC.hpCurrent += Math.max(1, (Dice(OPC.hdValue) + (Math.floor(OPC.abilityScores[2]/2)-5))); // hit dice value + con mod, minimum of 1
			OPC.hpCurrent = Math.min(OPC.hpCurrent, OPC.hpMax); // if current hp is greater than max hp, reduce to max
		}
		break;
	}
	OPC.hpCurrent = Math.max(OPC.hpCurrent, 1);
	document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax;
	roundCounter += 600;
	document.getElementById("round-timer").innerHTML='hrs:' + hours + ' /  min:' + minutes + ' / rnd:' + rounds;
	OPC.state = "conscious";
	OPC.goal = "travel";
};

// this function will heal OPC by the value of 1 hit dice + Con mod (to be expanded later)
function LongRest() {
	document.getElementById("opc-feedback").innerHTML="Eight hours pass..";
	OPC.hpCurrent = OPC.hpMax;
	OPC.hdRemaining = 1; // should be + 1/2 level round down, min 1, max level
	document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax;
	roundCounter += 4800;
	document.getElementById("round-timer").innerHTML='hrs:' + hours + ' /  min:' + minutes + ' / rnd:' + rounds;
	OPC.state = "conscious";
	OPC.goal = "travel";
};

// this function tracks the amount of time the game has been running and then writes it to the webpage
var roundCounter = 0; 
var rounds = 0;
var minutes = 0;
var hours = 0;
var nextRound;
function RoundTimer() {
	roundCounter ++;
	hours = Math.floor(roundCounter/600);
	minutes = Math.floor((roundCounter-(hours*600))/10);
	rounds = roundCounter-(hours*600)-(minutes*10);
	document.getElementById("round-timer").innerHTML='hrs:' + hours + ' /  min:' + minutes + ' / rnd:' + rounds;
	if(OPC.state == "dead") {
		document.getElementById("opc-feedback").innerHTML=OPC.name + " has died...";
		return;
	}
	switch(OPC.goal) {
	case "travel":
		TravelLHR();
		break;
	case "investigate":
		Investigate();
		break;
	case "combat":
		Combat();
		break;
	case "short rest":
		ShortRest();
		break;
	case "none":
		break;
	default:
		console.log("goal, default");
		break;
	}
	nextRound = setTimeout(RoundTimer, 6000); // re-runs the RoundTimer function every 6 seconds
};

/*
MAP RELATED FUNCTIONS
MAP RELATED FUNCTIONS
MAP RELATED FUNCTIONS
*/

var gridArr = [];

// this function generates the HTML for the grid
function CreateTileGrid() {
	var gridHTML = "";
	for(i=0; i<100; i++) {
		gridHTML += '<div class="grid" id="t' + i +'"></div>';
	}
	document.getElementById("tile-map").innerHTML=gridHTML;
};

// this function generates the HTML for the grid
function CreateGraphicsGrid() {
	var gridHTML = "";
	for(i=0; i<100; i++) {
		gridHTML += '<div class="grid" id="g' + i +'"></div>';
	}
	document.getElementById("graphics-map").innerHTML=gridHTML;
};

// this function builds the array for the map
function CreateMapArray() {
	gridArr = [];
	for(i=0; i<100; i++) {
		gridArr.push({open: 0, room: "", explored: 0, sDoor: 0, encounter: ""});
	}
};

// this function will return the X & Y positions of the gridArray
function GetXY(num) {
	xyPos = [];
	xyPos[1] = Math.floor(num / 10);
	xyPos[0] = num - (xyPos[1] * 10);
	return xyPos;
};

// this function will return an array for the path between two positions on the gridArr
function BestPathXY(start, end) {
	// best move XY
	currentPos = start;
	pathArr = [];
	while (currentPos != end) {
		xDiff = Math.abs(GetXY(currentPos)[0] - GetXY(end)[0]);
		yDiff = Math.abs(GetXY(currentPos)[1] - GetXY(end)[1]);
		if(xDiff >= yDiff) { // move WE		
			if(GetXY(currentPos)[0] > GetXY(end)[0]) {
				currentPos -= 1; // west

			}
			else {
				currentPos += 1; // east
			}
		}
		else {
			// move WE
			if(GetXY(currentPos)[1] > GetXY(end)[1]) {
				currentPos -= 10; // north
			}
			else {
				currentPos += 10; // south
			}
		}
		if(currentPos != end) {
			pathArr.push(currentPos);
		}
	}
	return pathArr;
};

// this function will populate the array with rooms
function PopulateMapRooms() {
	rNW = Dice(3) - 11 + Dice(3) * 10; // NW room
	gridArr[rNW].open = 1;
	gridArr[rNW].room = "NW";
	rNE = Dice(3) - 4 + Dice(3) * 10; // NE room
	gridArr[rNE].open = 1;
	gridArr[rNE].room = "NE";
	rCN = Dice(2) + 33 + Dice(2) * 10; // Central room
	gridArr[rCN].open = 1;
	gridArr[rCN].room = "CN";
	rSW =Dice(3) + 59 + Dice(3) * 10; // SW room
	gridArr[rSW].open = 1;
	gridArr[rSW].room = "SW";
	rSE = Dice(3) + 66 + Dice(3) * 10; // SE room
	gridArr[rSE].open = 1;
	gridArr[rSE].room = "SE";
	rST = Dice(2) + 3; // Start room
	gridArr[rST].open = 1;
	gridArr[rST].room = "ST";
	gridArr[rST].explored = 1;
};

// this function will populate the array with tunnels
function PopulateMapTunnels() {
	var roomPositions = [];
	for(var i = 0; i < gridArr.length; i++) { // find and store the start position
		if(gridArr[i].room == "ST"){
			roomPositions.push(i);
			break;
		}
	}
	for(var i = 0; i < gridArr.length; i++) { // find and store the central postion
		if(gridArr[i].room == "CN"){
			roomPositions.push(i);
			break;
		}
	}
	for(var i = 0; i < gridArr.length; i++) { // find and store the north west postion
		if(gridArr[i].room == "NW"){
			roomPositions.push(i);
			break;
		}
	}
	for(var i = 0; i < gridArr.length; i++) { // find and store the north east position
		if(gridArr[i].room == "NE"){
			roomPositions.push(i);
			break;
		}
	}
	for(var i = 0; i < gridArr.length; i++) { // find and store the south west postion
		if(gridArr[i].room == "SW"){
			roomPositions.push(i);
			break;
		}
	}
	for(var i = 0; i < gridArr.length; i++) { // find and store the south east position
		if(gridArr[i].room == "SE"){
			roomPositions.push(i);
			break;
		}
	}
	/*for(var i = 0; i < gridArr.length; i++) { // find and store the secret position
		if(gridArr[i].room == "SC"){
			roomPositions.push(i);
			break;
		}
	}*/
	switch(Dice(3)) {
		case 1: // S pattern
			tunnel = BestPathXY(roomPositions[0],roomPositions[3]); // ST to NE
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			tunnel = BestPathXY(roomPositions[3],roomPositions[2]); // NE to NW
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			tunnel = BestPathXY(roomPositions[2],roomPositions[1]); // NW to CN
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			tunnel = BestPathXY(roomPositions[1],roomPositions[5]); // CN to SE
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			tunnel = BestPathXY(roomPositions[5],roomPositions[4]); // SE to SW
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			break;
		case 2: // X pattern
			tunnel = BestPathXY(roomPositions[0],roomPositions[1]); // ST to CN
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			tunnel = BestPathXY(roomPositions[1],roomPositions[2]); // CN to NW
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			tunnel = BestPathXY(roomPositions[1],roomPositions[3]); // CN to NE
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			tunnel = BestPathXY(roomPositions[1],roomPositions[4]); // CN to SW
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			tunnel = BestPathXY(roomPositions[1],roomPositions[5]); // CN to SE
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			break;
		default: // spiral pattern
			tunnel = BestPathXY(roomPositions[0],roomPositions[3]); // ST to NE
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			tunnel = BestPathXY(roomPositions[3],roomPositions[5]); // NE to SE
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			tunnel = BestPathXY(roomPositions[5],roomPositions[4]); // SE to SW
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			tunnel = BestPathXY(roomPositions[4],roomPositions[2]); // SW to NW
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			tunnel = BestPathXY(roomPositions[2],roomPositions[1]); // NW to CN
			for(i = 0; i < tunnel.length; i++) {
				gridArr[tunnel[i]].open = 1;
				if(gridArr[tunnel[i]].room == "") {
					gridArr[tunnel[i]].room = "T";
				}
			}
			break;
	}
};

// this function will seed some random open space around the map
function PopulateRandomTunnels() {
	for(i = 0; i < 7; i) { // keep going until you find a number of valid positions
		randomPosition = Dice(100) - 1; // pick a random location on the grid
		validPosition = 0; // track position validity
		if(Math.floor((randomPosition - 1) / 10) == Math.floor(randomPosition / 10) && // west is not off edge
		gridArr[randomPosition - 1].open > 0 && // west is open
		gridArr[randomPosition - 1].room != "ST") { // is not start
			validPosition += 1;
		}
		if(Math.floor((randomPosition + 1) / 10) == Math.floor(randomPosition / 10) && // east is not off edge
		gridArr[randomPosition + 1].open > 0 && // east is open
		gridArr[randomPosition + 1].room != "ST") { // is not start
			validPosition += 100;
		}
		if(randomPosition - 10 >= 0 && // north is not off edge
		gridArr[randomPosition - 10].open > 0 && // north is open
		gridArr[randomPosition - 10].room != "ST") {
			validPosition += 1000;
		}
		if(randomPosition + 10 <= 99 && // south is not off edge
		gridArr[randomPosition + 10].open > 0 && // south is open
		gridArr[randomPosition + 10].room != "ST") {// is not start
			validPosition += 10;
		}
		if(gridArr[randomPosition].open < 1 && // is not already open
		validPosition > 0) { // is a valid position (beside an open space)
			gridArr[randomPosition].open = 1;
			gridArr[randomPosition].room = "R";
			i ++;
		}
	}
	// update the SC
};

// this function will add a secret room that is connected to an existing room or tunnel
function PopulateSecretRoom() {
	for(i=0; i < 2; i) { // keep going until you find a valid position
		secretPosition = Dice(80) + 19; // pick a random location on the grid
		validPosition = 0; // track position validity
		secretDoor = [];
		if(Math.floor((secretPosition - 1) / 10) == Math.floor(secretPosition / 10) && // west is not off edge
		gridArr[secretPosition - 1].open > 0 && // west is open
		gridArr[secretPosition - 1].room != "SC" && // west is not a secret room
		gridArr[secretPosition - 1].sDoor < 1) { // west is not a secret door
			validPosition = 1;
			secretDoor.push(secretPosition - 1);
		}
		if(Math.floor((secretPosition + 1) / 10) == Math.floor(secretPosition / 10) && // east is not off edge
		gridArr[secretPosition + 1].open > 0 && // east is open
		gridArr[secretPosition + 1].room != "SC" && // east is not a secret room
		gridArr[secretPosition + 1].sDoor < 1) { // east is not a secret door
			validPosition = 1;
			secretDoor.push(secretPosition + 1);
		}
		if(secretPosition - 10 >= 0 && // north is not off edge
		gridArr[secretPosition - 10].open > 0 && // north is open
		gridArr[secretPosition - 10].room != "SC" && // north is not a secret room
		gridArr[secretPosition - 10].sDoor < 1) { // north is not a secret door
			validPosition = 1;
			secretDoor.push(secretPosition - 10);
		}
		if(secretPosition + 10 <= 99 && // south is not off edge
		gridArr[secretPosition + 10].open > 0 && // south is open
		gridArr[secretPosition + 10].room != "SC" && // south is not a secret room
		gridArr[secretPosition + 10].sDoor < 1) { // south is not a secret door
			validPosition = 1;
			secretDoor.push(secretPosition + 10);
		}
		if(gridArr[secretPosition].open < 1 && // is not already open
		validPosition > 0) { // is a valid position (beside an open space)
			gridArr[secretPosition].open = 1;
			gridArr[secretPosition].room = "SC";
			secretDoorRoom = Dice(secretDoor.length) - 1;
			gridArr[secretDoor[secretDoorRoom]].sDoor = 1; // place the secret door randomly from the available options
			gridArr[secretPosition].exit = secretDoor[secretDoorRoom]; // track the exit
			i ++; // a valid position has been found for 1 secret room
		}
	}
}

// this function will determine viable exits from the tile
function GetExits(tile) {
	validExit = 0;
	if(Math.floor((tile - 1) / 10) == Math.floor(tile / 10) && // west is not off edge
	gridArr[tile - 1].open > 0) { // west is open
		if(gridArr[tile].room != "SC") { // tile is not a secret room
			if(gridArr[tile - 1].room != "SC" || // west is not a secret room OR
			gridArr[tile - 1].exit == tile) { // tile is the secret door for west ////////////////////// sample
				validExit += 1;
			}
		}
		else if(gridArr[tile].room == "SC" && // tile is a secret room
		gridArr[tile].exit == tile-1) { // west is the secret door		
			validExit += 1;
		}
	}
	if(Math.floor((tile + 1) / 10) == Math.floor(tile / 10) && // east is not off edge
	gridArr[tile + 1].open > 0) { // east is open
		if(gridArr[tile].room != "SC") { // tile is not a secret room
			if(gridArr[tile + 1].room != "SC" || // east is not a secret room OR
			gridArr[tile + 1].exit == tile) { // tile has a secret door
				validExit += 100;
			}
		}
		else if(gridArr[tile].room == "SC" && // tile is a secret room
		gridArr[tile].exit == tile + 1) { // east is the secret door
			validExit += 100;
		}
	}
	if(tile - 10 >= 0 && // north is not off edge
	gridArr[tile - 10].open > 0) { // north is open
		if(gridArr[tile].room != "SC") { // tile is not a secret room
			if(gridArr[tile - 10].room != "SC" || // north is not a secret room OR
			gridArr[tile - 10].exit == tile) { // tile has secret door
				validExit += 1000;
			}
		}
		else if(gridArr[tile].room == "SC" && // tile is a secret room
		gridArr[tile].exit == tile - 10) { // north is the secret door
			validExit += 1000;
		}
	}
	else if (gridArr[tile].room == "ST") {
		validExit += 1000;
	}
	if(tile + 10 <= 99 && // south is not off edge
	gridArr[tile + 10].open > 0) { // south is open
		if(gridArr[tile].room != "SC") { // tile is not a secret room
			if(gridArr[tile + 10].room != "SC" || // south is not a secret room OR
			gridArr[tile + 10].exit == tile) { // tile has secret door
				validExit += 10;
			}
		}
		else if(gridArr[tile].room == "SC" && // tile is a secret room
		gridArr[tile].exit == tile + 10) { // south is the secret door
			validExit += 10;
		}
	}
	return validExit;
}

// this function will add encounters to tunnel and rooms
function AddEncounters() {
	for(i=0; i < gridArr.length; i ++) {
		if(gridArr[i].open > 0 && // only do for open areas
		Dice(4) > 3) { // random chance to add an encounter
			gridArr[i].encounter = "combat";
		}
	}
};

// this function will update the graphics map based on room type in the array
function UpdateGraphicsMap() {
	for(i=0; i<gridArr.length; i++) { // do for the whole map array
		if (gridArr[i].open > 0) { // only work on open areas of the map
			exits = GetExits(i);
			switch(exits) { // determine which graphic to display to reflect the available exits
				case 1:
					img = "D";
					rotation = "270";
					break;
				case 10:
					img = "D";
					rotation = "180";
					break;
				case 11:
					img = "L";
					rotation = "180";
					break;
				case 100:
					img = "D";
					rotation = "90";
					break;
				case 101:
					img = "I";
					rotation = "90";
					break;
				case 110:
					img = "L";
					rotation = "90";
					break;
				case 111:
					img = "T";
					rotation = "90";
					break;
				case 1000:
					img = "D";
					rotation = "0";
					break;
				case 1001:
					img = "L";
					rotation = "270";
					break;
				case 1010:
					img = "I";
					rotation = "0";
					break;
				case 1011:
					img = "T";
					rotation = "180";
					break;
				case 1100:
					img = "L";
					rotation = "0";
					break;
				case 1101:
					img = "T";
					rotation = "270";
					break;
				case 1110:
					img = "T";
					rotation = "0";
					break;
				case 1111:
					img = "X";
					rotation = "";
					break;
			}
			if(gridArr[i].room == "T" ||
			gridArr[i].room == "R") {
				graphic = "url(img/png/tunnel" + img + rotation + ".png)";
			}
			else {
				graphic = "url(img/png/room" + img + rotation + ".png)";
			}
		//document.getElementById("g" + i.toString()).innerHTML = '<img class = "graphic" src="img/' + graphic + '" style="transform:rotate(' + rotation + 'deg)"></img>';
		document.getElementById("g" + i.toString()).style.backgroundImage = graphic;
		}
	}
};

// this function will update the tile map based on room type in the array
function UpdateTileMap() {
	for(i=0; i<gridArr.length; i++) { // do for the whole map array
		document.getElementById("t" + i.toString()).innerHTML = ""; // clears the letters off the map
		if(gridArr[i].room == "R") {
		//	document.getElementById("t" + i.toString()).innerHTML = "R";
		}
		if(gridArr[i].room == "SC") {
		//	document.getElementById("t" + i.toString()).innerHTML = "SC";
		}
		if(gridArr[i].sDoor > 0) {
		//	document.getElementById("t" + i.toString()).innerHTML = "D";
		}
		if(gridArr[i].encounter == "combat") {
			//document.getElementById("t" + i.toString()).innerHTML = "-C-";
		}
		if(gridArr[i].explored < 1) {
			document.getElementById("t" + i.toString()).style.backgroundColor = "rgba(255,255,255,1)";
		}
		else if(gridArr[i].explored > 0) {
			document.getElementById("t" + i.toString()).style.backgroundColor = "rgba(255,255,255,0)";
		}
	}
	if(OPC.currentPos >= 0) {
		document.getElementById("t" + OPC.currentPos.toString()).style.backgroundColor = "rgba(127,255,127,0.5)";
	}
};

// this function initializes the game mechanics
function GameStart() {
	GenerateCharacter();
	CreateTileGrid();
	CreateGraphicsGrid();
	CreateMapArray();
	PopulateMapRooms();
	PopulateMapTunnels();
	PopulateRandomTunnels();
	PopulateSecretRoom();
	AddEncounters();
	UpdateGraphicsMap();
	UpdateTileMap();
	RoundTimer();
};

/*
To Do List
- preload img folder
- locked doors between room
- Create new pathfinding function to return to a specific point (safe room for resting) using only explored tiles
- encounters
- combat!
	- retreat logic of OPC
- traps
- loot and equipment system
*/