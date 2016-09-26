var units = {
    king: {
        hp: 30,
        attack: 3,
        defence: 8,
        speed: 10,
        ap: 1,
        name: 'King'
    },
    cavalry: {
        hp: 30,
        attack: 2,
        defence: 0,
        speed: 30,
        ap: 2,
        name: 'Cavalry'
    },
    swordman: {
        hp: 15,
        attack: 1,
        defence: 2,
        speed: 35,
        ap: 1,
        name: 'Swordsman'
    },
    axemen: {
        hp: 20,
        attack: 2,
        defence: 4,
        speed: 10,
        ap: 1,
        name: 'Axeman'
    },
}

export default function Unit() {
    this.x = undefined;
    this.y = undefined;
    this.type = undefined;
    this.left = 0;
    this.top = 0;
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

    this.setAttributes = function () {
        let attributes = units[this.type];

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

        if (Math.floor(Math.random() * 100) < target.speed) {
            //dodge
            target.dodge++;
        } else {
            //hit
            let attack = this.attack - target.defence;
            if (attack < 0) attack = 1;
            attack = Math.floor(Math.random() * (attack+1));

            if (attack == 0) attack = 1;

            target.health -= attack;

            if (target.health <= 0) {
                setTimeout(function () {
                    target.setPos(-1,-1);
                },100);
                target.health = 0;
            }
        }

    }

    this.distance = function (x, y) {
        return Math.hypot(x-this.x, y-this.y);
    }

}