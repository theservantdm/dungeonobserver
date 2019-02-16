/*
Dungeon Observer JavaScript
Created: 30/12/2018
Updated: 19/01/2019
By:Derek Gilmore
Twitter: @TheServantDM

This file contains the code for the game systems
*/

// this function will move the OPC as determined by the other travel functions
function TravelMove(nextMove) {
	if(gridArr[nextMove].encounter == "combat"){ // switch from travel to combat
		OPC.goal = "combat";
		combatRounds = 0;
	}
	OPC.lastPos = OPC.currentPos;
	OPC.currentPos = nextMove;
	UpdateTileMap();
};

// this function will set the next move for the OPC to return the the previous tile
function TravelReturn() {
	nextMove = OPC.lastPos;
	OPC.goal = "short rest";
	TravelMove(nextMove);
};

// check to ensure no combat encounter is there
// this function will determine the next move through previously explored space that leads back to the start
function TravelExit() {
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
		if(exploredCounter/openCounter > 0.6) { // if mostly explored, create a new dungeon
			GenerateDungeon();
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
		else {
			OPC.goal = "long rest";
		}
	}
	pNorth = OPC.currentPos - 10;
	pEast = OPC.currentPos + 1;
	pSouth = OPC.currentPos + 10;
	pWest = OPC.currentPos - 1;
	pBest = 100;
	if(pNorth >= 0 && // is on map
	gridArr[pNorth].encounter != "combat" && // is not hostile
	gridArr[pNorth].explored > 0 && // has been explored
	//gridArr[pNorth].pathValue < gridArr[OPC.currentPos].pathValue && // is cloder to start than current posiiton
	gridArr[pNorth].pathValue  > 0) { // is a valid path to start
		if(gridArr[pNorth].pathValue < pBest) {
			nextMove = pNorth;
			pBest = gridArr[pNorth].pathValue;
		}
	}
	if(Math.floor(pEast / 10) == Math.floor(OPC.currentPos / 10) &&
	gridArr[pEast].encounter != "combat" &&
	gridArr[pEast].explored > 0 &&
	//gridArr[pEast].pathValue < gridArr[OPC.currentPos].pathValue && / is cloder to start than current posiiton
	gridArr[pEast].pathValue > 0) {
		if(gridArr[pEast].pathValue < pBest) {
			nextMove = pEast;
			pBest = gridArr[pEast].pathValue;
		}
	}
	if(pSouth < 100 &&
	gridArr[pSouth].encounter != "combat" &&
	gridArr[pSouth].explored > 0 &&
	//gridArr[pSouth].pathValue < gridArr[OPC.currentPos].pathValue && // is cloder to start than current posiiton
	gridArr[pSouth].pathValue > 0) {
		if(gridArr[pSouth].pathValue < pBest) {
			nextMove = pSouth;
			pBest = gridArr[pSouth].pathValue;
		}
	}
	if(Math.floor(pWest / 10) == Math.floor(OPC.currentPos / 10) &&
	gridArr[pWest].encounter != "combat" &&
	gridArr[pWest].explored > 0 &&
	//gridArr[pWest].pathValue < gridArr[OPC.currentPos].pathValue && // is cloder to start than current posiiton
	gridArr[pWest].pathValue > 0) {
		if(gridArr[pWest].pathValue < pBest) {
			nextMove = pWest;
			pBest = gridArr[pWest].pathValue;
		}
	}
	TravelMove(nextMove);
	document.getElementById("opc-feedback").innerHTML="To the exit!";	
};

// this function will determine the next move for the OPC using the "left hand rule"
function TravelLHR() {
	if(OPC.currentPos == -1) {
		for(var i = 0; i < gridArr.length; i++) { // find and store the start position and thi intial OPC locations
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
		if(exploredCounter/openCounter > 0.6) { // if 60% explored, create a new dungeon
			GenerateDungeon();
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
	gridArr[OPC.currentPos].explored ++;
	TravelMove(nextMove);
};

// this function will determine the next move for the OPC using the "right hand rule" to take the OPC to the dungeon start for a rest
function TravelRHR() {
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
		if(exploredCounter/openCounter > 0.6) { // if mostly explored, create a new dungeon
			GenerateDungeon();
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
		else {
			OPC.goal = "long rest";
		}
	}
	directionPriority = 0; // determine which was to go based on the left hand rule
	if(OPC.lastPos == OPC.currentPos - 1) {
		directionPriority = 3;
	}
	else if(OPC.lastPos == OPC.currentPos + 1) {
		directionPriority = 1;
	}
	else if(OPC.lastPos == OPC.currentPos - 10) {
		directionPriority = 4;
	}
	else if(OPC.lastPos == OPC.currentPos + 10) {
		directionPriority = 2;
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
		directionPriority --;
		if(directionPriority < 1) {
			directionPriority = 4;
		}
	}
	gridArr[OPC.currentPos].explored ++;
	TravelMove(nextMove);
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

// this function will scan the OPC inventory and equip the best gear
/*
Equip order by priority
	Main hand
		Check build for best weapon
		Exclude 2H
	Armor
	Off hand
		Does it need to be a light source?
		Check build for 2H, light, shield
Footman
	High AC (heavy armor + shield)
	STR based weapon
	ideally wants a glowing item equiped

	find best result for each slot
	find best light source for each slot
	compare results, what is the reduction from best in each slot to equip light
	equip the least reducing light source
	equip the best gear in the other slots
*/

function EquipBest() {
// Part 1: place all items in the backpack
	if(Array.isArray(OPC.mainHand)) {
		OPC.backpack.push(OPC.mainHand); // put current main hand weapon into pack
		OPC.mainHand = []; // empty main hand
	}
	if(Array.isArray(OPC.offHand)) {
		OPC.backpack.push(OPC.offHand); // put current off hand item into pack
		OPC.offHand = []; // empty off hand
	}
	if(Array.isArray(OPC.armor)) {
		OPC.backpack.push(OPC.armor); // put current armor into pack
		OPC.armor = []; // remove armor
	}
	OPC.backpack.sort(); // reorganise the backpack	
// Part 2: find best option ignoring light requirements
	switch(OPC.build) {
	case "footman":
	// find the best shield
		shieldPosBP = -1;
		shieldValue = 0;
		for(iEB = 0; iEB < OPC.backpack.length; iEB++) {
			if(OPC.backpack[iEB][0] == "s") { // only do for shields
				if(shieldPosBP == -1) {
					shieldPosBP = iEB;
					shieldValue = OPC.backpack[iEB][2];
					continue;
				}
				else if(shieldValue > OPC.backpack[iEB][2]) {
					continue;
				}
				else if(shieldValue == OPC.backpack[iEB][2] &&
				OPC.backpack[shieldPosBP][3] <= OPC.backpack[iEB][3]) {
					continue;
				}
				else {
					shieldPosBP = iEB;
					shieldValue = OPC.backpack[iEB][2];
				}
			}
		}
	// find the best weapon
		weaponPosBP = -1;
		weaponDamage = 0;
		for(iEB = 0; iEB < OPC.backpack.length; iEB++) {
			strMod = Math.floor(OPC.abilityScores[0] / 2) - 5;
			dexMod = Math.floor(OPC.abilityScores[1] / 2) - 5;
			if(OPC.backpack[iEB][0] == "w") { // only do for weapons
				if(shieldPosBP != -1) { // if a shield was found
					isTH = false; // set a variable to track two-handed weapon
					for(iTH = 0; iTH < OPC.backpack[iEB][4].length; iTH ++){							
						if(OPC.backpack[iEB][4][iTH] == "two-handed") {
							isTH = true;
							break;
						}
					}
					if(isTH == true) { // skip two-handed weapons
						continue;
					}
				}
				newDiceAverage = ((OPC.backpack[iEB][2][0] * OPC.backpack[iEB][2][1]) + OPC.backpack[iEB][2][1]) / 2;
				newDamage = (newDiceAverage + CalculateDamageBonus(OPC.backpack[iEB])) * (10 + CalculateAttackBonus(OPC.backpack[iEB]));
				if(weaponPosBP == -1){ // is this the first weapon found?
					weaponPosBP = iEB;
					weaponDamage = newDamage;
				}
				else if(weaponDamage > newDamage) { // current damage is better
					continue;
				}
				else if(weaponDamage == newDamage && // damage is equal
				OPC.backpack[weaponPosBP][5] <= OPC.backpack[iEB][5]) { // current weight is as good or better
					continue;
				}
				else {
					weaponPosBP = iEB;
					weaponDamage = newDamage;
				}
			}
		}
		/////////////////////////////////////// UPDATE FOR OFF HAND LIGHT WEAPONS //////////////////////////////////////////////

	// find the best armor
		armorClass = CalculateAC();
		armorPosBP = -1;
		for(iEB = 0; iEB < OPC.backpack.length; iEB++) {
			if(OPC.backpack[iEB][0] == "a") { // only do for armor
				newAC = CalculateAC(OPC.backpack[iEB]); 
				if(OPC.abilityScores[0] < OPC.backpack[iEB][4]) { // check strength requirement
					continue;
				}
				if(armorPosBP == -1){ // if this is the first viable armor, use it as a baseline
					armorPosBP = iEB;
					armorClass = newAC;
					continue;
				}
				else if(armorClass > newAC) { // this armor is not better
					continue;
				}
				else if(armorClass == newAC && // no change to AC
				OPC.backpack[armorPosBP][6] <= OPC.backpack[iEB][6]) { // current armor is lighter
					continue;
				}
				else {
					armorPosBP = iEB;
					armorClass = newAC;
				}
			}
		}
	}
// Part 3: find best light source for each slot
	lightPosMH = -1;
	lightValMH = 0;
	lightPosOH = -1;
	lightValOH = 0;
	lightPosA = -1;
	lightValA = 0;
	// loop through all contents of the backpack
	for(iLS = 0; iLS < OPC.backpack.length; iLS ++) {
		if(OPC.backpack[iLS][0] == "l") { // is a light source
			if(lightPosOH == -1) { // no light source assigned
				lightPosOH = iLS;
				lightValOH = OPC.backpack[iLS][2];
				continue;
			}
			else if(lightValOH > OPC.backpack[iLS][2]) { // has a worse radius
				continue;
			}
			else if(OPC.backpack[iLS][2] == lightValOH && // equal radius
			OPC.backpack[lightPosOH][3] <= OPC.backpack[iLS][3]) { // not a weight improvement
				continue;
			}
			else { // use this light source
				lightPosOH = iLS;
				lightValOH = OPC.backpack[iLS][2];
			}
			
		}
		else if(OPC.backpack[iLS][8] > 0) { // has a light radius
			switch(OPC.backpack[iLS][0]) {
			case "a":
				if(lightPosA == -1) { // no light source assigned
					lightPosA = iLS;
					lightValA = OPC.backpack[iLS][8];
					continue;
				}
				else if(lightValA >= OPC.backpack[iLS][8]) { // new is not an improvement
					continue;
				}
				else { // 
					lightPosA = iLS;
					lightValA = OPC.backpack[iLS][8];
					continue;
				}
				break;
			case "m": // the miscelaneous category is here as a placeholder //
				break;
			case "s":
				if(lightPosOH == -1) {
					lightPosOH = iLS;
					lightValOH = OPC.backpack[iLS][8];
					continue;
				}
				else if(lightValOH >= OPC.backpack[iLS][8]) {
					continue;
				}
				else {
					lightPosOH = iLS;
					lightValOH = OPC.backpack[iLS][8];
					continue;
				}
				break;
			case "w":
				if(lightPosMH == -1) { // main hand
					lightPosMH = iLS;
					lightPosMH = OPC.backpack[iLS][8];
					continue;
				}
				else if(lightPosMH >= OPC.backpack[iLS][8]) {
					continue;
				}
				else {
					lightPosMH = iLS;
					lightPosMH = OPC.backpack[iLS][8];
					continue;
				}
				isL = false; // set a variable to track light weapon
				for(iL = 0; iL < OPC.backpack[iEB][4].length; iL ++){							
					if(OPC.backpack[iEB][4][iL] == "light") {
						isL = true;
						break;
					}
				}
				if(isL == false) { // skip weapons that aren't light
					continue;
				}
				if(lightPosOH == -1) { // off hand
					lightPosOH = iLS;
					lightValOH = OPC.backpack[iLS][8];
					continue;
				}
				else if(lightValOH >= OPC.backpack[iLS][8]) {
					continue;
				}
				else {
					lightPosOH = iLS;
					lightValOH = OPC.backpack[iLS][8];
					continue;
				}				
				break;
			}
		}
	}
// Part 4: see which light source offers the least reduction
/*
Order matters here, armor before shield to better assess the impact of 2 additional AC
Build makes a big difference to off-hand equipment, especially since a torch is treated as a light weapon
Order priority needs to be laid out for each build, and then the function should be built to be flexible around that
*/
	// armor
	aACScore = 0;
	if(lightValA > 0) {
		aAC = CalculateAC(OPC.backpack[armorPosBP]);
		lAC = CalculateAC(OPC.backpack[lightPosA]);
		aACScore = lAC / aAC;
	}
	// off hand shield
	sACScore = 0;
	if(lightValOH > 0) {
		sACScore = aACScore / (aACScore + shieldValue);
	}
	// main hand
	wMHScore = 0;
	if(lightValMH > 0) {
		wMHDiceAverage = ((OPC.backpack[weaponPosBP][2][0] * OPC.backpack[weaponPosBP][2][1]) + OPC.backpack[weaponPosBP][2][1]) / 2;
		wMHDamage = (wMHDiceAverage + CalculateDamageBonus(OPC.backpack[weaponPosBP])) * (10 + CalculateAttackBonus(OPC.backpack[weaponPosBP]));
		lMHDiceAverage = ((OPC.backpack[lightPosMH][2][0] * OPC.backpack[lightPosMH][2][1]) + OPC.backpack[lightPosMH][2][1]) / 2;
		lMHDamage = (lMHDiceAverage + CalculateDamageBonus(OPC.backpack[lightPosMH])) * (10 + CalculateAttackBonus(OPC.backpack[lightPosMH]));
		wMHScore = lMHDamage / wMHDamage;
	}
	// off hand weaopn (there is currently nothing in place to equip an off-hand weapon)
	/*
	if(shieldValue == 0) {
		wOHDiceAverage = ((OPC.backpack[shieldPosBP][2][0] * OPC.backpack[shieldPosBP][2][1]) + OPC.backpack[shieldPosBP][2][1]) / 2;
		wOHDamage = (wOHDiceAverage + CalculateDamageBonus(OPC.backpack[shieldPosBP])) * (10 + CalculateAttackBonus(OPC.backpack[shieldPosBP]));
		lOHDiceAverage = ((OPC.backpack[lightPosOH][2][0] * OPC.backpack[lightPosOH][2][1]) + OPC.backpack[lightPosOH][2][1]) / 2;
		lOHDamage = (lOHDiceAverage + CalculateDamageBonus(OPC.backpack[lightPosOH])) * (10 + CalculateAttackBonus(OPC.backpack[lightPosOH]));
		wOHScore = lMHDamage / wMHDamage;
	}
	*/
	if(aACScore > sACScore) { // compare lighted armor to lighted shield
		bestResult = "a"; // result = armor
		scoreResult = aACScore; // score = aACScore
	}
	else {
		bestResult = "s"; // result = shield
		scoreResult = sACScore; // score = sACScore
	}
	if(wMHScore > scoreResult) {
		bestResult = "w"; // result = weapon
		scoreResult = wMHScore; // score = wMHScore
	}
	// put the best light source in the proper equipment placeholder
	switch(bestResult) {
		case "a":
			armorPosBP = lightPosA;
			OPC.light = OPC.backpack[armorPosBP][8]; // get new light setting from off hand item
			OPC.lightLoc = "armor";
			break;
		case "s":
			shieldPosBP = lightPosOH;
			OPC.light = OPC.backpack[shieldPosBP][8]; // get new light setting from off hand item
			OPC.lightLoc = "offHand";
			break;
		case "w":
			weaponPosBP = lightPosMH;
			OPC.light = OPC.backpack[weaponPosBP][8]; // get new light setting from off hand item
			OPC.lightLoc = "mainHand";
			break;
	}
// Part 5: equip the best gear
	// the backpack has been sorted by [0] of each item, so the order will be armor, lights, misc, shields, weapons
	// main hand weapon
	OPC.mainHand = OPC.backpack[weaponPosBP]; // put new weapon in main hand on
		console.log(OPC.backpack[weaponPosBP]);
		console.log(OPC.mainHand);
	OPC.backpack.splice(weaponPosBP, 1); // remove new weapon from pack
	// off hand shield
	OPC.offHand = OPC.backpack[shieldPosBP]; // put new light in off hand
		console.log(OPC.backpack[shieldPosBP]);
		console.log(OPC.offHand);
	OPC.backpack.splice(shieldPosBP, 1); // remove new light from pack
	// armor
	OPC.armor = OPC.backpack[armorPosBP]; // put new armor on
		console.log(OPC.backpack[armorPosBP]);
		console.log(OPC.armor);
	OPC.backpack.splice(armorPosBP, 1); // remove new armor from pack
	// backpack
	OPC.backpack.sort(); // reorganise the backpack
	// calculate character stats
	OPC.AC = CalculateAC();
	OPC.attackBonus = CalculateAttackBonus();
	OPC.damageDice = SetDamageDice();
	OPC.damageType = SetDamageType();
	OPC.damageBonus = CalculateDamageBonus();
	console.log(OPC.damageDice + " " + OPC.damageType);
};

// this function will 
function Loot() {
	//
};
/*
add item to inventory
- check for space
- check against value and drop lowest
*/

var combatStage = 0;
// this function will resolve combat
function Combat() {
	switch(combatStage){
		case 0:
			NPC = BatsAndRats();
			NPC.hpCurrent = NPC.hpMax;
			combatStage ++;
			document.getElementById("opc-feedback").innerHTML=OPC.name + " has entered combat with a " + NPC.name + "!";
			document.getElementById("npc-name").innerHTML=NPC.name;
			document.getElementById("npc-hp").innerHTML="HP: " + NPC.hpCurrent;
			return;
		case 1:			
			if(OPC.state == "conscious"){ // OPC is conscious, determine initiative
				rollOPC = Dice(20);
				rollBonusOPC = Math.floor(OPC.abilityScores[1]/2)-5;
				totalOPC = rollOPC + rollBonusOPC;
				rollNPC = Dice(20);
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
							if(OPC.hpCurrent < OPC.hpMax / 2) { // check current HP against danger zone
								OPC.goal = "return";
								document.getElementById("npc-name").innerHTML="";
								document.getElementById("npc-hp").innerHTML="";
								feedback += "<br>" + OPC.name + " retreats.";
								document.getElementById("opc-feedback").innerHTML=feedback;
								combatStage = 0;
								return;
							}
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
									damageDealtOPC = Dice(OPC.damageDice[0],OPC.damageDice[1]) + Dice(OPC.damageDice[0],OPC.damageDice[1]) + OPC.damageBonus;
									feedback += "<br>It hits critically for "
								}
								else {
									damageDealtOPC = Dice(OPC.damageDice[0],OPC.damageDice[1]) + OPC.damageBonus;
									feedback += "<br>It hits for "
								}
								feedback += damageDealtOPC + " " + OPC.damageType +" damage!";
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
									document.getElementById("npc-name").innerHTML="";
									document.getElementById("npc-hp").innerHTML="";
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
										document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax + " - HD: " + OPC.hdRemaining;
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
							document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax + " - HD: " + OPC.hdRemaining;
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
	if(OPC.hdRemaining >= 1) { // has hit dice remaning
		document.getElementById("opc-feedback").innerHTML="An hour passes...";
		while(OPC.hpCurrent < OPC.hpMax - (OPC.hdValue / 2) - (Math.floor(OPC.abilityScores[2]/2)-5) || // spend hit dice if missing hp = 1/2 hit dice value + con mod
		OPC.hpCurrent < OPC.hpMax) { 
			for(OPC.hdRemaining; OPC.hdRemaining > 0; OPC.hdRemaining --) {
				OPC.hpCurrent += Math.max(1, (Dice(OPC.hdValue) + (Math.floor(OPC.abilityScores[2]/2)-5))); // hit dice value + con mod, minimum of 1
				OPC.hpCurrent = Math.min(OPC.hpCurrent, OPC.hpMax); // if current hp is greater than max hp, reduce to max
			}
			break;
		}
		OPC.state = "conscious";
		OPC.goal = "return";
		document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax + " - HD: " + OPC.hdRemaining;
		roundCounter += 600;
		document.getElementById("round-timer").innerHTML='hrs:' + hours + ' /  min:' + minutes + ' / rnd:' + rounds;
		return;
	}
	else if(OPC.state == "unconscious") {
		document.getElementById("opc-feedback").innerHTML="An hour passes...";
		OPC.hpCurrent = Math.max(OPC.hpCurrent, 1);
		OPC.state = "conscious";
	}
	OPC.goal = "exit";
	AssignPathValue();
	document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax + " - HD: " + OPC.hdRemaining;
	roundCounter += 600;
	document.getElementById("round-timer").innerHTML='hrs:' + hours + ' /  min:' + minutes + ' / rnd:' + rounds;
};

// this function will heal OPC by the value of 1 hit dice + Con mod (to be expanded later)
function LongRest() {
	document.getElementById("opc-feedback").innerHTML="Eight hours pass..";
	OPC.hpCurrent = OPC.hpMax;
	OPC.hdRemaining = 1; // should be + 1/2 level round down, min 1, max level
	document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax + " - HD: " + OPC.hdRemaining;
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
	case "exit":
		TravelExit();
		break;
	case "investigate":
		Investigate();
		break;
	case "combat":
		Combat();
		break;
	case "return":
		TravelReturn();
		break;
	case "short rest":
		ShortRest();
		break;
	case "long rest":
		LongRest();
		break;
	case "none":
		break;
	default:
		console.log("goal, default");
		break;
	}
	nextRound = setTimeout(RoundTimer, 6000); // re-runs the RoundTimer function every 6 seconds
};

// this function initializes the game mechanics
function GameStart() {
	GenerateCharacter();
	CreateTileGrid();
	CreateGraphicsGrid();
	GenerateDungeon();
	RoundTimer();
};

/*
To Do List
- preload img folder
- encounters
- traps
- loot and equipment system
- leveling system
- quest system
*/