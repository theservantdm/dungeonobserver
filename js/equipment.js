/*
Dungeon Observer Equipment JavaScript
Created: 07/12/2018
Updated: 01/06/2019
By:Derek Gilmore
Twitter: @TheServantDM

This file contains the items for the game
*/

// weaopns
// [type,name,damage,damageType,properties,weight,copperValue,-,radius-bright,-]
// var dagger = [];
var dagger = ["w","dagger",[4,1],"piercing",["finesse","light","thrown"],1,200,0,0,""];
var greatSword = ["w","greatsword",[6,2],"slashing",["heavy","two-handed"],6,5000,0,0,""];
var longSword = ["w","longsword",[8,1],"slashing",["versatile"],3,1500,0,0,""];
var shortSword = ["w","shortsword",[6,1],"piercing",["finesse","light"],2,1000,0,0,""];
// var torch = ["w","torch",[4,1],"fire",["light"],1,1,0,20,""];

// armor
// [type,name,AC,maxDex,minStr,stealthPen,weight,copperValue,radius-bright]
	// Light
var leather = ["a","leather",11,100,0,0,10,1000,0,""];
var padded = ["a","padded",11,100,0,1,8,500,0,""];
var studdedLeather = ["a","studded leather",12,100,0,0,13,4500,0,""];
	// Medium
var hide = ["a","hide",12,2,0,0,12,1000,0,""];
var chainShirt = ["a","chain shirt",13,2,0,0,20,5000,0,""];
var scaleMail = ["a","scale mail",14,2,0,1,45,5000,0,""];
var breastplate = ["a","breastplate",14,2,0,0,20,40000,0,""];
var halfPlate = ["a","half plate",15,2,0,1,40,75000,0,""];
	// Heavy
var ringMail = ["a","ring mail",14,0,0,1,40,3000,0,""];
var chainMail = ["a","chain mail",16,0,13,1,55,7500,0,""];
var splint = ["a","splint",17,0,15,1,60,20000,0,""];
var plate = ["a","plate",18,0,15,1,65,150000,0,""];
	// Magic!
// var lightRobe = ["a","Light Robe",10,100,0,0,13,1000,10,""];

// shield
// [type,name,effect,weight,copperValue,-,-,-,radius-bright,-]
var shield = ["s","shield",2,6,10,0,0,0,0,""];

// light sources
// [type,name,radius-bright,weight,copperValue]
var torch = ["l","torch",20,1,1,""];
var lantern = ["l","lantern",30,2,500,""];

// miscellaneous
// [type,name,weight,copperValue]
var batCarcass = ["m","bat carcass",1,1,""];
var giantBatWing = ["m","giant bat wing",20,100,""];
var oil = ["m","oil",1,10,""];
var rations = ["m","rations",2,50];

// Random Treasure Tables

// Secret Rooms
function RTTSecretRoom() {
	treasure = [shortSword,longSword,studdedLeather,lantern]
	return treasure[Dice(treasure.length) - 1];
}