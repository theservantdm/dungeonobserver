/*
Dungeon Observer Equipment JavaScript
Created: 07/12/2018
Updated: 19/01/2019
By:Derek Gilmore
Twitter: @TheServantDM

This file contains the items for the game
*/

// weaopns
// [name,damage,damage type,properties,weight,copper,-,radius-bright,-]
// var dagger = [];
var dagger = ["w","dagger",[4,1],"piercing",["finesse","light","thrown"],1,200,0,0,""];
var greatSword = ["w","greatsword",[6,2],"slashing",["heavy","two-handed"],6,5000,0,0,""];
var longSword = ["w","longsword",[8,1],"slashing",["versatile"],3,1500,0,0,""];
var shortSword = ["w","shortsword",[6,1],"piercing",["finesse","light"],2,1000,0,0,""];
// var torch = ["w","torch",[4,1],"fire",["light"],1,1,0,20,""];

// armor
// [type,name,AC,maxDex,minStr,stealthPen,weight,copperValue,radius-bright]
var leather = ["a","leather",11,100,0,0,10,100,0,""];
var studdedLeather = ["a","studded leather",12,100,0,0,13,450,0,""];
// var lightRobe = ["a","Light Robe",10,100,0,0,13,1000,10,""];

// shield
// [type,name,effect,weight,value,-,-,-,radius-bright,-]
var shield = ["s","shield",2,6,10,0,0,0,0,""];

// light sources
// [type,name,radius-bright,weight,value]
var torch = ["l","torch",20,1,1,""];
var lantern = ["l","lantern",30,500,2,""];

// miscellaneous
// [type,name,weight,value]
var batCarcass = ["m","bat carcass",1,1,""];
var giantBatWing = ["m","giant bat wing",20,100,""];
var oil = ["m","oil",1,10,""];

// Random Treasure Tables

// Secret Rooms
function RTTSecretRoom() {
	treasure = [dagger,shortSword,longSword,studdedLeather]
	return treasure[Dice(treasure.length) - 1];
}