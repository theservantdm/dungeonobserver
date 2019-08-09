/*
Dungeon Observer JavaScript
Created: 30/12/2018
Updated: 14/06/2019
By:Derek Gilmore
Twitter: @TheServantDM

This file contains the code for the game systems
*/

// this function will move the OPC as determined by the other travel functions
function TravelMove(nextMove) {
	if(gridArr[nextMove].encounter == "combat"){ // switch from travel to combat
		OPC.encounter = "combat";
		combatRounds = 0;
	}
	else if(gridArr[nextMove].encounter == "trap") {
		OPC.encounter = "trap";
	}
	OPC.lastPos = OPC.currentPos;
	OPC.currentPos = nextMove;
	UpdateTileMap();
}

// this function will set the next move for the OPC to return the the previous tile
function TravelReturn() {
	nextMove = OPC.lastPos;
	OPC.encounter = "";
	if(OPC.hpCurrent < OPC.hpMax / 2) {
		OPC.goal = "short rest";
	}
	else {
		OPC.goal = "travel";
	}
	TravelMove(nextMove);
}

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
			return;
		}
	}
	nextMove = -1;
	pNorth = OPC.currentPos - 10;
	pEast = OPC.currentPos + 1;
	pSouth = OPC.currentPos + 10;
	pWest = OPC.currentPos - 1;
	pBest = 100;
	if(pNorth >= 0 && // is on map
	gridArr[pNorth].encounter != "combat" && // is not hostile
	gridArr[pNorth].explored > 0 && // has been explored
	//gridArr[pNorth}.room != "SC" &&
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
	if(nextMove == -1) { // a nextMove hasn't been found
		AssignPathValue(); // recalculate the path values
//		TravelExit(); // rerun this script
	}
	TravelMove(nextMove);
	document.getElementById("opc-feedback").innerHTML="To the exit!";	
}

// this function will determine the next move for the OPC using the "left hand rule"
function TravelLHR() {
	if(OPC.currentPos >= 0 && // is valid poisition
	OPC.currentPos <= 99) {
		if(gridArr[OPC.currentPos].loot.length != 0) { // there is some thing stored in the loot array for this position
			Loot(); // loot current position
			return; // skip the rest of the function
			}
		}
	if(OPC.currentPos == -1) {
		for(var i = 0; i < gridArr.length; i++) { // find and store the start position and the intial OPC locations
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
	directionPriority = 0; // determine which way to go based on the left hand rule
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
				OPC.encounter = "investigate";
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
	if(gridArr[OPC.currentPos].explored > 9) { // keep coming back to the same place
		for(i = 0; i < gridArr.length; i++) {
			if(gridArr[i].explored > 0) {
				gridArr[i].explored = 1;
			}
		}
		AssignPathValue(); // find a path to the exit
		OPC.goal = "exit"; // head back to the exit
	}
	else {
		TravelMove(nextMove);
	}
}

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
				OPC.encounter = "investigate";
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
}

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
				OPC.encounter = "";
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
			OPC.encounter = "";
			document.getElementById("opc-feedback").innerHTML=feedback;
			break;
	}
}

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
// Preamble: save existing light data
	previousLightType = "";
	if(OPC.lightLoc == "offHand") {
		previousLightType = OPC.offHand;
//		previousLightLife = OPC.lightLife;
	}
// Part 1: place all items in the backpack
	if(Array.isArray(OPC.mainHand)) {
		OPC.backpack.push(OPC.mainHand); // put current main hand weapon into pack
		OPC.mainHand = ""; // empty main hand
	}
	if(Array.isArray(OPC.offHand)) {
		OPC.backpack.push(OPC.offHand); // put current off hand item into pack
		OPC.offHand = ""; // empty off hand
	}
	if(Array.isArray(OPC.armor)) {
		OPC.backpack.push(OPC.armor); // put current armor into pack
		OPC.armor = ""; // remove armor
	}
	OPC.backpack.sort(); // reorganise the backpack	alphbetically based on item[0]
// Part 2: find best option ignoring light requirements
	switch(OPC.build) {
	case "footman":
	// find the best shield
		shieldPosBP = -1;
		shieldValue = 0;
		for(iEB = 0; iEB < OPC.backpack.length; iEB++) {
			if(OPC.backpack[iEB][0] == "s") { // only do for shields
				if(shieldPosBP == -1) { // haven't located a shield up to now
					shieldPosBP = iEB;
					shieldValue = OPC.backpack[iEB][2];
					continue;
				}
				else if(shieldValue > OPC.backpack[iEB][2]) { // not a defense improvement
					continue;
				}
				else if(shieldValue == OPC.backpack[iEB][2] && // as good defensively
				OPC.backpack[shieldPosBP][3] <= OPC.backpack[iEB][3]) { // not a weight improvement
					continue;
				}
				else { // update best shield option
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
		armorClassE = CalculateAC();
		armorPosBP = -1;
		for(iEB = 0; iEB < OPC.backpack.length; iEB++) {
			if(OPC.backpack[iEB][0] == "a") { // only do for armor
				newAC = CalculateAC(OPC.backpack[iEB]);
				if(OPC.abilityScores[0] < OPC.backpack[iEB][4]) { // check strength requirement
					continue;
				}
				if(armorPosBP == -1){ // if this is the first viable armor, use it as a baseline
					armorPosBP = iEB;
					armorClassE = newAC;
					continue;
				}
				else if(armorClassE > newAC) { // this armor is not better
					continue;
				}
				else if(armorClassE == newAC && // no change to AC
				OPC.backpack[armorPosBP][6] <= OPC.backpack[iEB][6]) { // current armor is lighter
					continue;
				}
				else {
					armorPosBP = iEB;
					armorClassE = newAC;
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
			if(OPC.backpack[iLS][1] == "lantern" && // is a lantern
				!OPC.backpack.includes(oil)) { // backpack doesn't have oil
				continue;
			}
			else {
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
	// the backpack has been sorted by item[0], so the order will be armor, lights, misc, shields, weapons
	// main hand weapon
	OPC.mainHand = OPC.backpack[weaponPosBP]; // put new weapon in main hand on
	OPC.backpack.splice(weaponPosBP, 1); // remove new weapon from pack
	// off hand shield
	OPC.offHand = OPC.backpack[shieldPosBP]; // put new light in off hand
	OPC.backpack.splice(shieldPosBP, 1); // remove new light from pack
	if(OPC.offHand !== previousLightType) { // it is a new type of light source
		if(OPC.offHand == torch) {
			OPC.lightLife = 600; // update torch life
		}
		else if(OPC.offHand == lantern) {
			OPC.backpack.splice(OPC.backpack.indexOf(oil),1); // remove the first instance of oil in the backpack
			OPC.lightLife = 3600; // increase the light life to 6 hours
		}
	}
	// armor
	OPC.armor = OPC.backpack[armorPosBP]; // put new armor on
	OPC.backpack.splice(armorPosBP, 1); // remove new armor from pack
	// backpack
	OPC.backpack.sort(); // reorganise the backpack
	// calculate character stats
	OPC.AC = CalculateAC();
	OPC.attackBonus = CalculateAttackBonus();
	OPC.damageDice = SetDamageDice();
	OPC.damageType = SetDamageType();
	OPC.damageBonus = CalculateDamageBonus();
	WriteOPC();
}
// End of EquipBest

// this function will loot for the OPC
function Loot() {
	for (iL = 0; iL < gridArr[OPC.currentPos].loot.length; iL ++) {
		OPC.backpack.push(gridArr[OPC.currentPos].loot[iL]);
		// update feedback with a message listing what was discovered
	}
	gridArr[OPC.currentPos].loot = [];
	CalculateEncumberance();
	gridArr[OPC.currentPos].loot = [];
	EquipBest();
	OPC.encounter = "";
}

// this function will deal damage to the OPC
function DamageOPC(damageAmount) {
	OPC.hpCurrent -= damageAmount;
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
	WriteOPC();
}

function LightSource() {
	if(OPC.offHand[1] == "torch" || // check to see if a torch is equipped
		OPC.offHand[1] == "lantern") { // check to see if a lantern is equipped
		OPC.lightLife --; // reduce light life
	}
	if(OPC.lightLife < 1) { // check for spent light source
		if(OPC.offHand[1] == "torch") { // check to see if a torch is equipped
			if(OPC.backpack.includes(torch)) { // swaping to a new torch
				OPC.backpack.splice(OPC.backpack.indexOf(torch),1); // remove the first instance of torch in the backpack
				OPC.lightLife = 600; // increase the light life to 1 hour
				feedback += OPC.name + " pulls a new torch from their backpack and lights it."; // update feedback
			}
			else { // doens't have another torch
				OPC.offHand = []; // destroy torch in OPC.offHand
				feedback = OPC.name + "'s torch flickers and burns out..."; // create feedback
			}
		}
		if(OPC.offHand[1] == "lantern") { // check to see if a lantern is equipped
			if(OPC.backpack.includes(oil)) { // check backpack for oil
				OPC.backpack.splice(OPC.backpack.indexOf(oil),1); // remove the first instance of oil in the backpack
				OPC.lightLife = 3600; // increase the light life to 6 hours
				feedback += OPC.name + " tops up their lantern with a flask of oil."; // update feedback
			}
			else { // no oil in backpack
				feeback += "The oil has run out in " + OPC.name + "'s lantern"; // update feedback
				EquipBest(); // run EquipBest() to find new light source
			}
			feedback = OPC.name + ""; // create feedback
		}
		document.getElementById("opc-feedback").innerHTML = feedback; // update feedback
	}
	else if(OPC.lightLife < 600 &&
		!OPC.backpack.includes(torch)) {
		OPC.goal = "exit";
	}
	WriteOPC();
}

var combatStage = 0;
// this function will resolve combat
function Combat() {
	switch(combatStage){
		case 0:	
			combatStage ++;
			document.getElementById("opc-feedback").innerHTML = OPC.name + " has entered combat with a " + gridArr[OPC.currentPos].nonPC.name + "!";
			document.getElementById("npc-name").innerHTML = gridArr[OPC.currentPos].nonPC.name;
			document.getElementById("npc-hp").innerHTML = "HP: " + gridArr[OPC.currentPos].nonPC.hpCurrent;
			gridArr[OPC.currentPos].notes = "Encountered a " + gridArr[OPC.currentPos].nonPC.name + " here.";
			return;
		case 1:			
			if(OPC.state == "conscious"){ // OPC is conscious, determine initiative
				rollOPC = Dice(20);
				rollBonusOPC = Math.floor(OPC.abilityScores[1]/2)-5; // Dex for bonus
				totalOPC = rollOPC + rollBonusOPC;
				rollNPC = Dice(20);
				rollBonusNPC = Math.floor(gridArr[OPC.currentPos].nonPC.abilityScores[1]/2)-5;
				totalNPC = rollNPC + rollBonusNPC;
				feedback = OPC.name + " initiative: " + rollOPC + " + " + rollBonusOPC + " = " + (totalOPC) + "<br>" + gridArr[OPC.currentPos].nonPC.name + " initiative: " + rollNPC + " + " + rollBonusNPC + " = " + (totalNPC);
				turnOrder = 0;
				if(totalOPC > totalNPC) { // determine turn order based on initiative rolls
					turnOrder = 1;
					feedback += "<br>" + OPC.name + " goes first!";
				}
				else if(totalOPC < totalNPC) {
					turnOrder = 2;
					feedback += "<br>" + gridArr[OPC.currentPos].nonPC.name + " goes first!";
				}
				else { // determine turn order based on dexterity scores
					if(OPC.abilityScores[1] > gridArr[OPC.currentPos].nonPC.abilityScores[1]) {
						turnOrder = 1;
						feedback += "<br>" + OPC.name + " goes first!";
					}
					else if(OPC.abilityScores[1] < gridArr[OPC.currentPos].nonPC.abilityScores[1]) {
						turnOrder = 2;
						feedback += "<br>" + gridArr[OPC.currentPos].nonPC.name + " goes first!";
					}
					else { // randomly decide turn order
						if(Dice(2) > 1) {
							turnOrder = 1;
							feedback += "<br>" + OPC.name + " goes first!";
						}
						else {
							turnOrder = 2;
							feedback += "<br>" + gridArr[OPC.currentPos].nonPC.name + " goes first!";
						}
					}
				}
			}
			else { // OPC is unconscious or stable, NPC goes first
				turnOrder = 2;
				feedback += "<br>" + gridArr[OPC.currentPos].nonPC.name + " goes first!";
			}
			feedback += "<br>"; // add a line of space for ease of reading
			for(turn = 0; turn < 2; turn) {
				switch(turnOrder) {
					case 1: // OPC turn
						if(OPC.state == "conscious") {
							if(OPC.hpCurrent < OPC.hpMax / 2) { // check current HP against danger zone
								OPC.goal = "return";
								OPC.encounter = "";
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
							else if(attackTotalOPC < gridArr[OPC.currentPos].nonPC.AC) { // miss
								feedback += "<br>It misses!";
							}
							else if(attackTotalOPC >= gridArr[OPC.currentPos].nonPC.AC || // hit
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
								for(iDR = 0; iDR < gridArr[OPC.currentPos].nonPC.damageRes.length; iDR ++) {
									if(gridArr[OPC.currentPos].nonPC.damageRes[iDR] == "piercing") { //////////////////////////////////////// base off OPC weapon!
										damageResistedNPC = Math.ceil(damageDealtOPC/2);
										damageDealtOPC -= damageResistedNPC;
										feedback += "<br>But the " + gridArr[OPC.currentPos].nonPC.name + " resisted " + damageResistedNPC + " of it.";
										break;
									}
								}
								gridArr[OPC.currentPos].nonPC.hpCurrent -= damageDealtOPC;
								document.getElementById("npc-hp").innerHTML="HP: " + gridArr[OPC.currentPos].nonPC.hpCurrent;
								if(gridArr[OPC.currentPos].nonPC.hpCurrent < 1) {
									feedback += "<br>" + gridArr[OPC.currentPos].nonPC.name + " was slain!";
									document.getElementById("opc-feedback").innerHTML = feedback;
									//////////////////////////////////////////////////////////////////////////////////// XP gain
									OPC.experience += Math.max(200 * gridArr[OPC.currentPos].nonPC.CR, 10);
									document.getElementById("opc-xp").innerHTML="XP: " + OPC.experience;
									//////////////////////////////////////////////////////////////////////////////////// XP gain
									document.getElementById("npc-name").innerHTML = "-";
									document.getElementById("npc-hp").innerHTML = "-";
									gridArr[OPC.currentPos].notes = "Killed a " + gridArr[OPC.currentPos].nonPC.name + " here.";
									OPC.encounter ="loot";
									gridArr[OPC.currentPos].encounter = "";
									if(gridArr[OPC.currentPos].nonPC.loot.length > 0) {
										gridArr[OPC.currentPos].loot = gridArr[OPC.currentPos].nonPC.loot;
									}
									gridArr[OPC.currentPos].nonPC = "";
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
								OPC.encounter = "";
								combatStage = 0;
							}
							else if(OPC.deathSaveFail >= 3) {
								OPC.state = "dead";
								OPC.goal = "none";
								OPC.encounter = "";
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
							feedback += "<br>" + gridArr[OPC.currentPos].nonPC.name + " uses " + gridArr[OPC.currentPos].nonPC.actions.attack[0]; // declare attack
							attackRollNPC = Dice(20); // roll for attack
							attackTotalNPC = attackRollNPC + gridArr[OPC.currentPos].nonPC.actions.attack[1]; // attack roll + attack bonus
							feedback += "<br> Attack: " + attackRollNPC + " + " + gridArr[OPC.currentPos].nonPC.actions.attack[1] + " = " + attackTotalNPC;
							if(attackTotalNPC == 1) { // is a critical miss
								feedback += "<br>It misses horribly!";
							}
							else if(attackTotalNPC < OPC.AC) { // miss
								feedback += "<br>It misses!";
							}
							else if(attackTotalNPC >= OPC.AC || // hit
							attackRollNPC == 20) { // or critical hit
								if(attackRollNPC == 20) { // critical hit!
									damageDealtNPC = Dice(gridArr[OPC.currentPos].nonPC.actions.attack[3][0],gridArr[OPC.currentPos].nonPC.actions.attack[3][1]) + Dice(gridArr[OPC.currentPos].nonPC.actions.attack[3][0],gridArr[OPC.currentPos].nonPC.actions.attack[3][1]) + gridArr[OPC.currentPos].nonPC.actions.attack[4];
									feedback += "<br>It hits critically for "
								}

								else {
									damageDealtNPC = Dice(gridArr[OPC.currentPos].nonPC.actions.attack[3][0],gridArr[OPC.currentPos].nonPC.actions.attack[3][1]) + gridArr[OPC.currentPos].nonPC.actions.attack[4];
									feedback += "<br>It hits for "
								}
								feedback += damageDealtNPC + " " + gridArr[OPC.currentPos].nonPC.actions.attack[5] + " damage!";
								OPC.hpCurrent -= damageDealtNPC;
								if(OPC.hpCurrent < 1) {
									if(OPC.hpCurrent <= OPC.hpMax * -1) {
										OPC.state = "dead";
										OPC.goal = "none";
										OPC.encounter = "";
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
							feedback += "<br>" +  gridArr[OPC.currentPos].nonPC.name + " ignores the unconscious " + OPC.name + ".";
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
}

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

// This function will determine what occurs when a trap is encountered
function Trap() {
	trapDC = 10;
	switch(gridArr[OPC.currentPos].trapState) {
		case 1: // trap set and waiting
			roll = Dice(20);
			rollBonus = Math.floor(OPC.abilityScores[4]/2)-5; // add Wisdom modifier
			if(OPC.skills.includes("perception")) { //check to see if perception is a skill
					rollBonus += OPC.proficiencyBonus; // add proficiency bonus
				}
			feedback = "Wisdom (Perception): " + roll + " + " + rollBonus + " = " + (roll + rollBonus) + "<br>";
			if(roll + rollBonus >= trapDC) { // make an wisdom perception check to see if you notice the trap trigger
				feedback += "What have we here..?";
				gridArr[OPC.currentPos].trapState = 2; //	set switch to 2
			}
			else {
				feedback += "*shrug*";
				gridArr[OPC.currentPos].trapState = 5; //	set switch to 5
			}
			break;
		case 2: // trigger detected
			roll = Dice(20); //	INT (investigation) check to understand trap
			rollBonus = Math.floor(OPC.abilityScores[3]/2)-5; // add Intelligence modifier
			if(OPC.skills.includes("investigation")) { //check to see if investigation is a skill
					rollBonus += OPC.proficiencyBonus; // add proficiency bonus
				}
			feedback = "Intelligence (Investigation): " + roll + " + " + rollBonus + " = " + (roll + rollBonus) + "<br>";
			if(roll + rollBonus >= trapDC + 5) { // great success
				feedback += "Simple enough...";
				gridArr[OPC.currentPos].trapState = 3; //	set switch to 3
			}
			else if (roll + rollBonus >= trapDC) { // success
				feedback += "Should be simple to avoid that...";
				gridArr[OPC.currentPos].trapState = 4; //	set switch to 4
			}
			else if (roll + rollBonus < trapDC) { // failure
				feedback += "This is too easy...";
				gridArr[OPC.currentPos].trapState = 5; // set switch to 5
			}
			break;
		case 3: // trap understood completely			
			feedback = "*Triggers the trap from a safe distance*<br>"; // message to observer
			gridArr[OPC.currentPos].trapState = 0; //	set switch to 0
		//	gridArr[OPC.currentPos].trapType = ""; //	remove trap type (not required)
			gridArr[OPC.currentPos].encounter = ""; //	remove encounter type
			OPC.encounter = "";
				gridArr[OPC.currentPos].notes = "Trap safely disabled.";
			break;
		case 4: // trap understood
			roll = DiceAdvantage(20); // bypass trap with Dexterity (Acrobatics) check at advantage
			rollBonus = Math.floor(OPC.abilityScores[1]/2)-5; // add Dexterity modifier
			if(OPC.skills.includes("acrobatics")) { // check to see if acrobatics is a skill
					rollBonus += OPC.proficiencyBonus; // add proficiency bonus
				}
			feedback = "Dexterity (Acrobatics): " + roll + " + " + rollBonus + " = " + (roll + rollBonus) + "<br>";
			if(roll + rollBonus >= trapDC) { // successfully avoids trap
				feedback += "*Avoids trap*"; // observer feedback
				// the trap stays active in this tile, so the OPC will continue to encounter it going forward, we leave the gridArr trapState and encounter as is
				OPC.encounter = "";
				gridArr[OPC.currentPos].notes = "Trap here.";
			}
			else { // triggers trap
				feedback += "*Triggers trap*";
				gridArr[OPC.currentPos].trapState = 5; // set switch to 5
			}
			break;
		case 5: // trap triggered
			roll = Dice(20); //	trigger trap accidentally, Dexterity saving throw
			rollBonus = Math.floor(OPC.abilityScores[1]/2)-5; // add Dexterity modifier
			if(OPC.savingThrows.includes("dexterity")) { // check to see if dexterity is a saving throw
					rollBonus += OPC.proficiencyBonus; // add proficiency bonus
				}
			feedback = "Dexterity saving throw: " + roll + " + " + rollBonus + " = " + (roll + rollBonus) + "<br>";
			if(roll + rollBonus >= trapDC) { // success - set switch to 0, set trapType to ""
				feedback += "The trap triggers, but " + OPC.name + " dodges."; // feedback
				gridArr[OPC.currentPos].trapState = 0; // set switch to 0
				gridArr[OPC.currentPos].encounter = ""; //	remove encounter type
				OPC.encounter = "";
			}
			else if(roll + rollBonus < trapDC) { // failure - set switch to 6
				DamageOPC(Dice(4)); // deal 1d4 damage to the OPC
				if(OPC.hpCurrent == 0) {
					OPC.state = "stable";
					OPC.goal = "short rest";
					OPC.encounter = "";
				}
				feedback += "The trap triggers and " + OPC.name + " is caught!"; // feedback
				gridArr[OPC.currentPos].trapState = 6; // set switch to 6
			}
			break;
		case 6: // ongoing effect
			roll = Dice(20); //	attempt to break free with Strength (Athletics) check
			rollBonus = Math.floor(OPC.abilityScores[0]/2)-5; // add Strength modifier
			if(OPC.skills.includes("athletics")) { // check to see if athletics is a skill
					rollBonus += OPC.proficiencyBonus; // add proficiency bonus
				}
			feedback = "Strength (Athletics): " + roll + " + " + rollBonus + " = " + (roll + rollBonus) + "<br>";
			if(roll + rollBonus >= trapDC) { //	success - set switch to 0
				feedback += OPC.name + " successfully frees themselves from the trap."; // feedback
				gridArr[OPC.currentPos].trapState = 0; // set switch to 0
				gridArr[OPC.currentPos].encounter = ""; //	remove encounter type
				OPC.encounter = "";
				gridArr[OPC.currentPos].notes = "Got trapped here, it hurt!";
			}
			if(roll + rollBonus < trapDC) { //	failure - damage, no change
				DamageOPC(1); // deal 1 damage to the OPC
				if(OPC.hpCurrent == 0) {
					OPC.state = "stable";
					OPC.goal = "short rest";
					OPC.encounter = "";
				}
				feedback += OPC.name + " fails to free themselves from the trap."; // feedback
			}			
			break;
		default:
		console.log("trap state: " + gridArr[OPC.currentPos].trapState);
			break;
	}
	document.getElementById("opc-feedback").innerHTML=feedback;
	if(OPC.encounter == "") {
		OPC.experience += (trapDC - 5) * 5;
		//*************************************************************************************************
		// currently this gives XP everytime the OPC goes past a trap in state 4, that might have to change
		//*************************************************************************************************
		WriteOPC();// write OPC 
	}
}

// this function will heal OPC by the value of 1 hit dice + Con mod (to be expanded later)
function ShortRest() {
console.log("entering short rest");
	if(OPC.hdRemaining >= 1) { // has hit dice remaning
		document.getElementById("opc-feedback").innerHTML="An hour passes...";
		while(OPC.hpCurrent < OPC.hpMax - (OPC.hdValue / 2) - (Math.floor(OPC.abilityScores[2]/2)-5)) { // spend hit dice if missing hp = 1/2 hit dice value + con mod 
			for(OPC.hdRemaining; OPC.hdRemaining > 0; OPC.hdRemaining --) {
				OPC.hpCurrent += Math.max(1, (Dice(OPC.hdValue) + (Math.floor(OPC.abilityScores[2]/2)-5))); // hit dice value + con mod, minimum of 1
				OPC.hpCurrent = Math.min(OPC.hpCurrent, OPC.hpMax); // if current hp is greater than max hp, reduce to max
			}
			break;
		}
		OPC.state = "conscious";
/*		
		if(gridArr[OPC.currentPos].encounter == "trap") {
			OPC.encounter = "trap";
		}
		else {
			OPC.goal = "return";
		}
*/
		document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax + " - HD: " + OPC.hdRemaining; // update HP display
		roundCounter += 600; // add an hour to the timer
		if(gridArr[OPC.currentPos].room != "ST") { // ensure the OPC is not at the start room
			OPC.lightLife -= 600; // remove an hour from the life of the light source
		}
		document.getElementById("round-timer").innerHTML='hrs:' + hours + ' /  min:' + minutes + ' / rnd:' + rounds; // update the timer display
	}
	else if(OPC.state == "unconscious" ||
			OPC.state == "stable") {
		document.getElementById("opc-feedback").innerHTML="An hour passes...";
		OPC.hpCurrent = Math.max(OPC.hpCurrent, 1);
		OPC.state = "conscious";
	}
//	if(gridArr[OPC.currentPos].encounter == "trap") {
//		OPC.goal = "trap";
//	}
/*
- check HP against threshold
	- return
	- exit
*/
	if(OPC.hpCurrent >= OPC.hpMax / 2) { // has 1/2 or more HP
		if(OPC.lastPos.explored > 0) {
			OPC.goal = "travel";
		}
		else {
			OPC.goal = "return";
		}
	}
	else { // has less than 1/2 HP
		OPC.goal = "exit";
		AssignPathValue();
	}
	document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax + " - HD: " + OPC.hdRemaining; // update HP & hit die display
	roundCounter += 600; // add 1 hour to timer
	document.getElementById("round-timer").innerHTML='hrs:' + hours + ' /  min:' + minutes + ' / rnd:' + rounds; // update timer display
}

// this function will heal OPC by the value of 1 hit dice + Con mod (to be expanded later)
function LongRest() {
//	level up...
	AdvanceXP = [0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000]; // XP in array to compare to level
	feedback = "Eight hours pass...";
	if(AdvanceXP[OPC.level] <= OPC.experience) {
		OPC.level ++; // increment level
		newHP = Dice(OPC.hdValue) + Math.floor(OPC.abilityScores[2]/2) - 5; // roll HP
		OPC.hpMax += newHP; // increase HP
		OPC.proficiencyBonus = Math.ceil(Math.max(OPC.level - 1,1) / 4) + 1; // increase proficiency bonus
		// add abilities
		feedback += "<br>" + OPC.name + " levels up!<br>HP increased by " + newHP;
		WriteOPC();// write OPC 
	}
// rest...
	if(OPC.backpack.includes(rations)) { // if backpack contains rations, allow rest		
		OPC.backpack.splice(OPC.backpack.indexOf(rations), 1); // remove the item// remove 1 rations
		document.getElementById("opc-feedback").innerHTML = feedback; // update feedback display
		OPC.hpCurrent = OPC.hpMax; // heal to max HP
		OPC.hdRemaining = Math.min(OPC.hdRemaining + Math.max(Math.floor(OPC.level / 2),1),OPC.level) // recover 1/2 leve in hit dice
		document.getElementById("opc-hp").innerHTML='HP ' + OPC.hpCurrent + " / " + OPC.hpMax + " - HD: " + OPC.hdRemaining; // update hit point & dice display
		roundCounter += 2880; // add 8 hours to the timer
		document.getElementById("round-timer").innerHTML='hrs:' + hours + ' /  min:' + minutes + ' / rnd:' + rounds; // update the timer display
		OPC.state = "conscious";
		OPC.encounter = "merchant";
		OPC.goal = "travel"; 
	}
	else { //  if backpack does not contain rations
		OPC.state = "conscious";
		OPC.encounter = "merchant";
		feedback += "<br>" + OPC.name + " needs food to recover...";
		document.getElementById("opc-feedback").innerHTML = feedback;
		return;
	}
}

// This function will sell loot from the OPC backpack and restock their supplies
function Merchant() {
	EquipBest(); // ensure the best gear is equiped before stating
	feedback = OPC.name + " visits the merchant:<br>";
// sell the items in the backpack
	merchNoBuyList = [torch,5,rations,5,lantern,1,oil,4]; // these things will not be sold from the backpack
	backpackTally = [lantern,0,oil,0,rations,0,torch,0]; // track how many of each item are in the backpack
	for(iMS = 0; iMS < OPC.backpack.length; iMS ++) {
		if(merchNoBuyList.includes(OPC.backpack[iMS])) { // check if current item is on the No Buy List
			backpackTally[backpackTally.indexOf(OPC.backpack[iMS]) + 1] ++;
			if(backpackTally[backpackTally.indexOf(OPC.backpack[iMS]) + 1] <= merchNoBuyList[merchNoBuyList.indexOf(OPC.backpack[iMS]) + 1]) { // count is less than the sell point
				continue; // move on
			}
		}
		// give half the cash value
		feedback += "<br>";
		switch (OPC.backpack[iMS][0]) { // get the purchase value from the item array
			case "a": // 7 - armour
				copperValue = OPC.backpack[iMS][7];
				break;
			case "l": // 4 - light sources
			case "s": // 4 - shields
				copperValue = OPC.backpack[iMS][4];
				break;
			case "m": // 3 - misc.
				copperValue = OPC.backpack[iMS][3];
				break;
			case "w": // 5 - weapons
				copperValue = OPC.backpack[iMS][6];
				break;
		}
		copperValue = Math.ceil(copperValue / 2); // sell value is half purchase value 
		OPC.copper += copperValue; // add half the copper to the OPC stock
		feedback += OPC.backpack[iMS][1] + " sold for " + copperValue + " cp.";
		copperValue = 0; // reset the copperValue
		OPC.backpack.splice(iMS, 1); // remove the item
		iMS --; // cycle the tracker back to account for the removed item
	}
	feedback += "<br>";
// restock items in the backpack
	merchRestockItem = [torch,5,oil,4,rations,5]; // these things will be restocked to a set amount
	OPC.backpack.sort(); // sort the backpack alphabetically to group like things together
	for(iMR = 0; iMR < merchRestockItem.length; iMR += 2) {
		if(OPC.backpack.includes(merchRestockItem[iMR])) {
			itemAmount = (OPC.backpack.lastIndexOf(merchRestockItem[iMR]) - OPC.backpack.indexOf(merchRestockItem[iMR])) + 1; // calculate the number of an item
		}
		else {
			itemAmount = 0;
		}
		if(itemAmount < merchRestockItem[iMR + 1]) { // if there are not enough
			for(itemAmount; itemAmount < merchRestockItem[iMR + 1]; itemAmount ++) { // for loop to buy items while there is enough money
				feedback += "<br>";
				switch (merchRestockItem[iMR][0]) {
					case "a": // 7 - armour
						itemCost = merchRestockItem[iMR][7];
						break;
					case "l": // 4 - light sources
					case "s": // 4 - shields
						itemCost = merchRestockItem[iMR][4];
						break;
					case "m": // 3 - misc.
						itemCost = merchRestockItem[iMR][3];
						break;
					case "w": // 5 - weapons
						itemCost = merchRestockItem[iMR][6];
						break;
				}
				if(OPC.copper >= itemCost) { // is there enough money? (set up for torches)
					OPC.copper -= itemCost; // remove copper
					OPC.backpack.push(merchRestockItem[iMR]); // add item to backpack
					feedback += merchRestockItem[iMR][1] + " purchased for " + itemCost + " cp.";
				}
				else { // if there is not enough money
					break; // end to purchasing loop
				}
			}
		}
	}
	feedback += "<br>" + OPC.name + " leaves the merchant.";
	document.getElementById("opc-feedback").innerHTML=feedback;
	EquipBest();
//	OPC.goal = "travel";
	OPC.encounter = "";
	WriteOPC();
	/*
	- equiup best just in case
	- sell things in the backpack that are not on a keep list
	- purchase things from the store to restock supplies; this will be based on what light source is available
	- create a list of items that are in stock
	- add some way to track currency (cp) which should be reflected in carry capacity
	*/
}

// this function will advance the progress bar for the 6 second round
var roundProgress;
var roundProgressNumber;
function RoundProgress() {
	if(roundProgressNumber >= 100) {
		roundProgressNumber = -20;
	}
	roundProgressNumber += 20;
	document.getElementById("round-progress-bar").style.width = roundProgressNumber + "%";
	roundProgress = setTimeout(RoundProgress, 1000); // re-runs the RoundProgress function every second
}

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
	// dictate OPC actions
	if(OPC.encounter == "") { // no encounter to deal with
		switch(OPC.goal) {
			case "exit":
				TravelExit();
				break;
			case "long rest":
				LongRest();
				break;
			case "return":
				TravelReturn();
				break;
			case "short rest":
				ShortRest();
				break;
			case "travel":
				TravelLHR();
				break;
	/*		case "investigate":
				Investigate();
				break;
			case "combat":
				Combat();
				break;
			case "merchant":
				Merchant();
				break;
			case "loot":
				Loot();
				break;
			case "trap":
				Trap();
				break; */
			case "none":
				break;
			default:
				console.log("goal, default");
				break;
		}	
	}
	else { // there is an encounter to deal with
		switch(OPC.encounter) {
			case "combat":
				Combat();
				break;
			case "investigate":
				Investigate();
				break;
			case "loot":
				Loot();
				break;
			case "merchant":
				Merchant();
				break;
			case "trap":
				Trap();
				break;
		}
	}
	
// slowly reduce light sources
	LightSource();
// track the seconds between rounds with a visual display
	roundProgressNumber = -20;
	clearTimeout(roundProgress);
	RoundProgress();
// trigger the next round
	nextRound = setTimeout(RoundTimer, 6000); // re-runs the RoundTimer function every 6 seconds
}

// this function initializes the game mechanics
function GameStart() {
	GenerateCharacter();
	CreateTileGrid();
	CreateGraphicsGrid();
	CreateNoteGrid();
	GenerateDungeon();
	RoundTimer();
}

/*
To Do List
- preload img folder
- boss fight for better loot
- quest system
- multiple levels
- locked doors between room
- long rest to consume rations
*/
