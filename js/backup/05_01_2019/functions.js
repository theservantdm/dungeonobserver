/*
Dungeon Observer JavaScript
Created: 30/12/2018
Updated: 04/01/2019
By:Derek Gilmore
Twitter: @TheServantDM
*/

// this function emulates a die roll
function Dice(sides) {
	var dieRoll = Math.floor(Math.random() * sides) + 1;
	return dieRoll;
};

// this function rolls 4d6, discards the lowest result, and sums the remaining
function FourDieSix() {
	var dOne = Dice(6);
	var dTwo = Dice(6);
	var dThree = Dice(6);
	var dFour = Dice(6);
	return dOne + dTwo + dThree + dFour - Math.min(dOne,dTwo,dThree,dFour);
};

// this function will return the highest value from an array
function ArrayFindPositionHighest(array) {
	highValue = 0;
	highValuePosition = -1;
	for(var iV = 0; iV < array.length; iV++) {
		if(array[iV] > highValue) {
			highValue = array[iV];
			highValuePosition = iV;
		}
	}
	return highValuePosition;
};