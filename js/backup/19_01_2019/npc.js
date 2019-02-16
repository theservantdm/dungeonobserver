/*
Dungeon Observer JavaScript
Created: 30/12/2018
Updated: 07/01/2019
By:Derek Gilmore
Twitter: @TheServantDM

This file contains the code for the game's NPCs
*/

/*
NPC RELATED FUNCTIONS
NPC RELATED FUNCTIONS
NPC RELATED FUNCTIONS
*/

function GenerateNPC(name, size, type, alignment, AC, hpMax, hitDice, speed, speedClimb, speedFly, abilityScores, damageVul, damageRes, damageImm, conditionImm, senses, languages, CR, traits, actions, bonusActions, loot) {
	this.name = name;
	this.size = size;
	this.type = type;
	this.alignment = alignment;
	this.AC = AC;
	this.hpMax = hpMax;
	this.hpCurrent = hpMax;
	this.hitDice = hitDice;
	this.speed = speed;
	this.speedClimb = speedClimb;
	this.speedFly = speedFly;
	this.abilityScores = abilityScores;
	this.damageVul = damageVul;
	this.damageRes = damageRes;
	this.damageImm = damageImm;
	this.conditionImm = conditionImm;
	this.senses = senses;
	this.languages = languages;
	this.CR = CR;
	this.traits = traits;
	this.actions = actions;
	this.bonusActions = bonusActions;
	this.loot = loot;
};

function RandomNPC0() {
	switch(Dice(2)) {
		case 1:
			return new GenerateNPC("Bat", "tiny", "beast", "unaligned", 12, 1, [1,4], 5, 5, 30, [2,15,8,1,12,4], [], [], [], [], ["blindsight 60"], ["none"], 0, ["echolocation","keen hearing"],{attack:["bite",0,5,[1,1],0,"piercing"]},[],[batCarcass]);
			break;
		case 2:
			return new GenerateNPC("Rat", "tiny", "beast", "unaligned", 10, 1, [1,4], 20, 0, 0, [2,11,9,2,10,4], [], [], [], [], ["darkvision 30"], ["none"], 0, ["keen smell"],{attack:["bite",0,5,[1,1],0,"piercing"]},[]);
			break;
	};
};
function RandomNPC1_8() {
	switch(Dice(1)) {
		case 1:
			return new GenerateNPC("Giant Rat", "small", "beast", "unaligned", 12, 7, [2,6], 30, 0, 0, [7,15,11,2,10,4], [], [], [], [], ["darkvision 60"], ["none"], 1/8, ["keen smell","pack tactics"],{attack:["bite",4,5,[4,1],2,"piercing"]},[]);
			break;
	};
};
function RandomNPC1_4() {
	switch(Dice(2)) {
		case 1:
			return new GenerateNPC("Swarm of Bats", "medium", "beast", "unaligned", 13, 22, [4,10], 10, 10, 60, [5,15,10,2,12,4], [], ["bludgeoning","piercing","slashing"], [], ["charmed","frightened","grappled","paralysed","petrified","prone","restrained","stunned"], ["blindsight 60"], ["none"], 1/4, ["echolocation","keen hearing","swarm"],{attack:["bite",4,0,[4,2],0,"piercing"],weakAttack:["bite",4,0,[4,1],0,"piercing"]},[],[batCarcass,batCarcass,batCarcass,batCarcass]);
			break;	
		case 2:
			return new GenerateNPC("Giant Bat", "large", "beast", "unaligned", 12, 22, [5,8], 0, 0, 30, [15,16,11,2,12,6], [], [], [], [], ["blindsight 60"], ["none"], 1/4, ["echolocation","keen hearing"],{attack:["bite",4,5,[6,1],2,"piercing"]},[],[giantBatWing]);
			break;
	};
};

function BatsAndRats() {
	switch(Dice(6,2)){
		case 2: // 1
		case 12: // 1
			return RandomNPC1_4();
			break;
		case 3: // 2
		case 4: // 3
		case 10: // 3
		case 11: // 2
			return RandomNPC1_8();
			break;
		case 5: // 4
		case 6: // 5
		case 7: // 6
		case 8: // 5
		case 9: // 4
			return RandomNPC0();
			break;
	}

};