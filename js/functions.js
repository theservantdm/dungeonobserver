/*
Dungeon Observer JavaScript
Created: 30/12/2018
Updated: 07/01/2019
By:Derek Gilmore
Twitter: @TheServantDM

This file contains simple, commonly used functions
*/

// this function will constrain a number to within a range
function Constrain(num, max, min) {
	return Math.min(max, Math.max(num, min));
};

// this function emulates a die roll
function Dice(sides = 20, num = 1) { // default to 1d20
	dieRoll = 0;
	for(iD = 0; iD < num; iD ++) {
		dieRoll += Math.floor(Math.random() * sides) + 1;
	}
	return dieRoll;
};

// this function rolls 4d6, discards the lowest result, and sums the remaining
function FourDieSix() {
	dOne = Dice(6);
	dTwo = Dice(6);
	dThree = Dice(6);
	dFour = Dice(6);
	return dOne + dTwo + dThree + dFour - Math.min(dOne,dTwo,dThree,dFour);
};

function DiceAdvantage(num = 20) { // defaults to d20
	dOne = Dice(num);
	dTwo = Dice(num);
	return Math.max(dOne,dTwo); // returns the higher of the two rolls
};

function DiceDisadvantage(num = 20) { // default to d20
	dOne = Dice(num);
	dTwo = Dice(num);
	return Math.min(dOne,dTwo); // returns the lower of the two rolls
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