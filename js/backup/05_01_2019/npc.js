/*
Dungeon Observer JavaScript
Created: 30/12/2018
Updated: 04/01/2019
By:Derek Gilmore
Twitter: @TheServantDM
*/

/*
NPC RELATED FUNCTIONS
NPC RELATED FUNCTIONS
NPC RELATED FUNCTIONS
*/

var npc;

function NPC(name, size, type, alignment, AC, HP, HD, speed, speedClimb, speedFly, attributes, senses, languages, traits, attack) {
	this.name = name;
	this.size = size;
	this.type = type;
	this.alignment = alignment;
	this.AC = AC;
	this.HP = HP;
	this.HD = HD;
	this.speed = speed;
	this.speedClimb = speedClimb;
	this.speedFly = speedFly;
	this.attributes = attributes;
	this.senses = senses;
	this.languages = languages;
	this.traits = traits;
	this.attack = attack;
};

function RandomNPC() {
	switch(Dice(2)) {
		case 1:
			return new NPC("Bat", "tiny", "beast", "unaligned", 12, 1, [1,4], 5, 5, 30, [2,15,8,1,12,4], ["blindsight 60"], ["none"], ["echolocation","keen hearing"],[0,5,1]);
			break;
		case 2:
			return new NPC("Giant Bat", "large", "beast", "unaligned", 13, 22, [4,10], 10, 10, 60, [15,16,11,2,12,6], ["blindsight 60"], ["none"], ["echolocation","keen hearing"],[4,5,Dice(6)+2]);
			break;
	};
};