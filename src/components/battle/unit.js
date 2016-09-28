import SoundManager from '../../sound/manager'
import Vue from 'vue'

export var units = {
    king: {
        hp: 50,
        attack: 10,
        defence: 4,
        speed: 10,
        ap: 1,
        range_attack: false,
        range: 0,
        name: 'King'
    },
    cavalry: {
        hp: 20,
        attack: 4,
        defence: 3,
        speed: 30,
        ap: 3,
        range_attack: false,
        range: 0,
        name: 'Cavalry'
    },
    swordman: {
        hp: 15,
        attack: 5,
        defence: 2,
        speed: 10,
        ap: 2,
        range_attack: false,
        range: 0,
        name: 'Swordsman'
    },
    axemen: {
        hp: 20,
        attack: 6,
        defence: 1,
        speed: 10,
        ap: 2,
        range_attack: false,
        range: 0,
        name: 'Axeman'
    },
    archer: {
        hp: 15,
        attack: 4,
        defence: 0,
        speed: 10,
        ap: 1,
        range_attack: true,
        range: 5,
        name: 'Archers'
    },
}

export var bonus = {
    forest: {attack:2,defence:0,speed:0},
    rock: {attack:0,defence:2,speed:0}
}

export default function Unit() {
    this.x = undefined;
    this.y = undefined;
    this.type = undefined;
    this.left = 0;
    this.top = 0;
    this.arrowLeft = 0;
    this.arrowTop = 0;
    this.showArrow = false;

    this.rotation = 0;
    this.top = 0;
    this.movable = true;
    this.moving = false;

    this.health = 10;
    this.maxHealth = 10;
    this.attack = 10;
    this.defence = 10;
    this.speed = 10;
    this.maxAp = 1;
    this.adhesion = {};
    this.stats = {};
    this.rangeAttack = false;
    this.range = 0;

    this.movments = {};

    this.ap = this.maxAp;
    this.party = undefined;

    //statistics
    this.hit = 0;
    this.defended = 0;
    this.dodge = 0;

    this.name = 'Unit';

    this.setPos = function (x, y) {
        this.x = x;
        this.y = y;

        return this;
    }

    this.setParty = function (party) {
        this.party = party;

        return this;
    }

    this.setMovable = function (movable) {
        this.movable = movable;

        return this;
    }

    this.setType = function (type) {
        this.type = type;
        this.setAttributes();

        return this;
    }


    this.checkAdhesion= function (type, can) {
        if (can.left == type) return true;
        if (can.leftup == type) return true;
        if (can.leftdown == type) return true;
        if (can.right == type) return true;
        if (can.rightup == type) return true;
        if (can.rightdown == type) return true;

        return false;

    };

    this.getAdhesion = function (can) {
        var that = this;
        var adhesion = {
            forest: that.checkAdhesion('forest',can),
            rock: that.checkAdhesion('rock',can),
        };

        return adhesion;
    };

    this.setAttributes = function () {
        let attributes = units[this.type];

        this.rangeAttack = attributes.range_attack;
        this.range = attributes.range;

        this.maxHealth = attributes.hp;
        this.health = this.maxHealth;
        this.attack = attributes.attack;
        this.defence = attributes.defence;
        this.speed = attributes.speed;
        this.maxAp = attributes.ap;

        this.ap = this.maxAp;

        this.name = attributes.name;
    }

    this.defendUnit = function (attacker) {

    }

    this.attackUnit = function (target) {
        this.ap --;

        if (Math.floor(Math.random() * 100) < target.stats.speed) {
            //dodge
            target.dodge++;
        } else {
            //hit
            let attack = this.stats.attack - target.stats.defence;
            if (attack <= 0) attack = 1;

            target.health -= attack;

            if (target.health <= 0) {
                setTimeout(function () {
                    target.setPos(-1,-1);
                    SoundManager.playSound('unit_death')
                },100);
                target.health = 0;

            }
        }

    }

    this.distance = function (x, y) {
        return Math.hypot(x-this.x, y-this.y);
    }

    this.calculateStats = function () {
        let stats = {
            attack: this.attack,
            defence: this.defence,
            speed: this.speed,
        };

        for (var adhesion in this.adhesion) {

            if (this.adhesion[adhesion] && bonus.hasOwnProperty(adhesion)) {
                for (var stat in stats) {
                    stats[stat] += bonus[adhesion][stat];
                }
            }
        }

        this.stats = stats;
    }

    this.inRange = [];

    this.calculateRange = function (map) {
        var inRange = [];

        for (var i = 0; i < map.length; i++) {
            var unitPack = map[i];

            if (this.distance(unitPack.x, unitPack.y) <= this.range && unitPack.unit != undefined && unitPack.unit.party != undefined && unitPack.unit.party != this.party ){
                inRange.push(unitPack);
            }
        }


        this.inRange = inRange;
    }

}