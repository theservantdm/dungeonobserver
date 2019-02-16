/*
Dungeon Observer JavaScript
Created: 30/12/2018
Updated: 19/01/2019
By:Derek Gilmore
Twitter: @TheServantDM

This file contains the code for the map generation and display
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
		gridArr.push({open: 0, room: "", explored: 0, sDoor: 0, pathValue: 0, encounter: ""});
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
	gridArr[rST].pathValue = 1;
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
	switch(Dice(3)) { // randomly pick the shape 
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
		gridArr[i].room != "ST" && // do not place on start tile
		gridArr[i].room != "SC" && // do not place on secret chambers
		Dice(4) > 3) { // random chance to add an encounter
			gridArr[i].encounter = "combat";
		}
	}
};

// this function will assign a vaule to each open tile based on the distance from the start tile 
function AssignPathValue() {
	for(iI = 0; iI < 20; iI ++) { // scan the grid repeatedly to fill in all the spots
		for(iPV = 0; iPV < 100; iPV ++) {
			if(gridArr[iPV].pathValue > 0 && // has an assigned path value
			gridArr[iPV].explored > 0 && // only apply to explored places
			gridArr[iPV].open > 0) { // is an open space
				iNorth = iPV - 10;
				if(iNorth >= 0 && // is on map
				gridArr[iNorth].explored > 0 && // only check explored places
				gridArr[iNorth].open > 0) { // is an open tile
					if(gridArr[iNorth].pathValue < 1 || // unassigned path value
					gridArr[iNorth].pathValue > gridArr[iPV].pathValue + 1) { // there is a new shortest way there
						gridArr[iNorth].pathValue = gridArr[iPV].pathValue + 1;
					}
				}
				iEast = iPV + 1;
				if(iEast <= 100 && // is on map
				gridArr[iEast].explored > 0 && // only check explored places
				Math.floor(iEast / 10) == Math.floor(iPV / 10) && // is on same Y axis as iPV
				gridArr[iEast].open > 0) { // is an open tile
					if(gridArr[iEast].pathValue < 1 || // unassigned path value
					gridArr[iEast].pathValue > gridArr[iPV].pathValue + 1) { // there is a new shortest way there
						gridArr[iEast].pathValue = gridArr[iPV].pathValue + 1;
					}
				}
				iSouth = iPV + 10;
				if(iSouth < 100 && // is on map
				gridArr[iSouth].explored > 0 && // only check explored places
				gridArr[iSouth].open > 0) { // is an open tile
					if(gridArr[iSouth].pathValue < 1 || // unassigned path value
					gridArr[iSouth].pathValue > gridArr[iPV].pathValue + 1) { // there is a new shortest way there
						gridArr[iSouth].pathValue = gridArr[iPV].pathValue + 1;
					}
				}
				iWest = iPV - 1;
				if(iWest >= 0 && // is on map
				gridArr[iWest].explored > 0 && // only check explored places
				Math.floor(iWest / 10) == Math.floor(iPV / 10) && // is on same Y axis as iPV
				gridArr[iWest].open > 0) { // is an open tile
					if(gridArr[iWest].pathValue < 1 || // unassigned path value
					gridArr[iWest].pathValue > gridArr[iPV].pathValue + 1) { // there is a new shortest way there
						gridArr[iWest].pathValue = gridArr[iPV].pathValue + 1;
					}
				}
			}
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
		else {
			document.getElementById("g" + i.toString()).style.backgroundImage = "";
		}
	}
};

// this function will update the tile map based on room type in the array
function UpdateTileMap() {
	for(i=0; i<gridArr.length; i++) { // do for the whole map array
		document.getElementById("t" + i.toString()).innerHTML = ""; // clears the letters off the map
		if(gridArr[i].open == 1) {
			//document.getElementById("t" + i.toString()).innerHTML = gridArr[i].pathValue;
		}
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
			document.getElementById("t" + i.toString()).style.backgroundColor = "rgba(255,255,255,.5)";
		}
		else if(gridArr[i].explored > 0) {
			document.getElementById("t" + i.toString()).style.backgroundColor = "rgba(255,255,255,0)";
		}
	}
	if(OPC.currentPos >= 0) {
		document.getElementById("t" + OPC.currentPos.toString()).style.backgroundColor = "rgba(127,255,127,0.5)";
	}
};

// this function generates a new dungeon
function GenerateDungeon() {
	CreateMapArray();
	PopulateMapRooms();
	PopulateMapTunnels();
	PopulateRandomTunnels();
	PopulateSecretRoom();
	AddEncounters();
	UpdateGraphicsMap();
	UpdateTileMap();
};

/*
To Do List
- preload img folder
- locked doors between room
- Create new pathfinding function to return to a specific point (safe room for resting) using only explored tiles
- encounters
- traps
- loot and equipment system
- leveling system
- quest system
*/