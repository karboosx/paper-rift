var units = {
    king:{
        hp:30,
        attack:3,
        defence:8,
        speed:10,
        ap:1,
        name:'King'
    },
    cavalry:{
        hp:10,
        attack:2,
        defence:0,
        speed:30,
        ap:2,
        name:'Cavalry'
    },
    swordman:{
        hp:15,
        attack:1,
        defence:2,
        speed:35,
        ap:1,
        name:'Swordsman'
    },
    axemen:{
        hp:20,
        attack:2,
        defence:4,
        speed:10,
        ap:1,
        name:'Axeman'
    },
}

export default function Unit(){
    this.x = undefined;
    this.y = undefined;
    this.type = undefined;
    this.left = 0;
    this.top = 0;
    this.rotation = 0;
    this.top = 0;

    this.hp = 10;
    this.maxHp = 10;
    this.attack = 10;
    this.defence = 10;
    this.speed = 10;
    this.maxAp = 1;

    this.ap = this.maxAp;
    this.party = undefined;

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

    this.setType = function (type) {
        this.type = type;
        this.setAttributes();

        return this;
    }

    this.setAttributes = function () {
        let attributes = units[this.type];

        this.maxHp = attributes.hp;
        this.hp = this.maxHp;
        this.attack = attributes.attack;
        this.defence = attributes.defence;
        this.speed = attributes.speed;
        this.maxAp = attributes.ap;

        this.ap = this.maxAp;

        this.name = attributes.name;
    }

}