<template>
    <div @mousemove="moveCursor">
        <div class="finish win" v-if="win" transition="opacity">
            <div>
                <div class="text">You win!</div>
                <a class="link" v-link="{name:'camp'}">Back to camp</a>
            </div>
        </div>
        <div class="finish lose" v-if="lose" transition="opacity">
            <div>
                <div class="text">You lose!</div>
                <a class="link" v-link="{name:'index'}">Back to menu</a>
            </div>
        </div>

        <div class="ornament top"></div>
        <div class="ornament bottom"></div>
        <div class="next_turn">
            <div class="gui next_turn" @click="nextTurn" v-show="playerTurn">TURN</div>
        </div>

        <div class="container">
            <div :style="{width:((x*1+0.5)*sizeX)+'px', height:((y*1.05)*sizeY)+'px'}" class="map mud" id="map">

                <div class="hex" v-for="hex in map" :class="[hex.unitType]" :style="{top:hex.top+'px'}" @click="selectHex(hex.x,hex.y, hex.unit)">
                    <div class="hex_inner" :class="{hover:playerTurn,selected:(hex.unit == selectedUnit && hex.unit != undefined && playerTurn), moving:(hex.unit != undefined && hex.unit.moving)}" :style="{left:hex.left+'px'}">
                        <hex v-if="hex.unit != undefined" :can.sync="hex.can" :hex="hex" :range="(selectedUnit != undefined ? selectedUnit.inRange : [])" :unit.sync="hex.unit" :adhesion.sync="hex.adhesion" :selected="hex.unit == selectedUnit && hex.unit != undefined" :player-turn="playerTurn"></hex>
                    </div>
                </div>

            </div>

            <div class="info" :class="{left:cursor_on_left}" v-if="selectedUnit != undefined && playerTurn">

                <div class="unit_image" :class="[selectedUnit.type]"></div>

                <div class="adhesion forest" v-show="selectedUnit.adhesion.forest" transition="movein_adhesion">
                    {{ (bonus.forest.attack>0 ? '+'+bonus.forest.attack : bonus.forest.attack) }}
                    <div class="icon small sword"></div>
                </div>
                <div class="adhesion rock" v-show="selectedUnit.adhesion.rock" transition="movein_adhesion">
                    {{ (bonus.rock.defence>0 ? '+'+bonus.rock.defence : bonus.rock.defence) }}
                    <div class="icon small shield"></div>
                </div>

                <div class="gui basic one info_panel">
                    <div class="information big">
                        {{ selectedUnit.name }}
                    </div>
                    <div class="information" :class="{bouns:selectedUnit.adhesion.forest}">
                        <div class="icon small sword"></div>
                        {{ selectedUnit.stats.attack }}
                    </div>
                    <div class="information" :class="{bouns:selectedUnit.adhesion.rock}">
                        <div class="icon small shield"></div>
                        {{ selectedUnit.stats.defence }}
                    </div>
                    <div class="information">
                        <div class="icon small boots"></div>
                        {{ selectedUnit.stats.speed }}%
                    </div>
                    <div class="information">
                        <div class="icon small arrow"></div>
                        {{ selectedUnit.ap }} / {{ selectedUnit.maxAp }}
                    </div>
                    <div class="information medium">
                        <div class="icon small heart"></div>
                        {{ selectedUnit.health }} / {{ selectedUnit.maxHealth }}
                    </div>
                </div>
            </div>
        </div>
        <!--<div class="turn_info" v-show="showMyTurn" transition="showMyTurn">-->
            <!--<div class="gui basic four">-->
                <!--Your turn-->
            <!--</div>-->
        <!--</div>-->

        <div class="turn_info" v-show="startIntro" transition="showMyTurn">
            <div class="gui basic four small">
                Crush you enemy!
            </div>
        </div>
    </div>
    <options v-if="isOptionsShow"></options>
</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'
    import Hex from './hex.vue'
    import EnemyAI from './enemy_ai'
    import Unit from './unit'
    import {bonus} from './unit'
    import SoundManager from '../../sound/manager'
    import OptionsMixin from '../../mixins/options'
    import Options from '../../components/options/options.vue'

    export default {
        mixins:[EnemyAI, OptionsMixin],
        name:'battle',
        props:['x','y', 'own','enemy','obstacles'],
        data: function () {
            return {
                isOptionsShow:false,
                playerTurn:true,
                showMyTurn:false,
                startIntro:false,

                screenX:100,
                screenY:100,
                cursorX:100,
                cursorY:100,

                sizeX:100,
                sizeY:90,
                selectedX:undefined,
                selectedY:undefined,
                selectedUnit:undefined,

                bonus:bonus
            }
        },
        components: {
            Hex, Options
        },
        methods:{
            canJump: function (unit, x,y) {
                if (Math.abs(unit.x-x)>1 || Math.abs(unit.y-y)>1){
                    return false;
                }

                if (unit.y%2 != 0 && unit.x+1==x && unit.y+1==y){
                    return false;
                }

                return true;
            },
            nextOwnTurn: function () {
                for (var i = 0; i < this.own.length; i++) {
                    var unit = this.own[i];
                    unit.ap = unit.maxAp;
                }
            },
            nextEnemyTurn: function () {
                this.nextEnemyTurnStart();
            },
            nextTurn: function () {
                if (this.playerTurn) {
                    this.nextOwnTurn();
                    this.nextEnemyTurn();
                }
            },
            inRange: function (attacker, target) {
//                attacker.calculateRange();
                var attackerRange = attacker.inRange;

                if (attacker.rangeAttack) {
                    for (var i = 0; i < attackerRange.length; i++) {
                        var unitPack = attackerRange[i];

                        if (target == unitPack.unit) {
                            return true;
                        }
                    }
                }

                return false;
            },
            makeUnitAttack: function (attacker, defender, callback) {
                callback = callback || function (){};

                var unit = attacker;
                var x = defender.x;
                var y = defender.y;

                var inRange = this.inRange(attacker,defender);

                if (!this.canJump(unit,x,y) && !inRange) return false;

                var newAnimation = undefined;
                var newAnimationTick = 0;

                unit.moving = true;
                if (inRange) {

                    var startX = attacker.x * this.sizeX;
                    var startY = attacker.y * this.sizeY;

                    var stopX = defender.x * this.sizeX;
                    var stopY = defender.y * this.sizeY;

                    if (defender.y%2 == 0){
                        stopX += this.sizeX/2;
                    }

                    if (attacker.y%2 == 0){
                        stopX -= this.sizeX/2;
                    }

                    var timeout = Math.ceil(Math.hypot(stopX - startX, stopY - startY)/3);

                    var directionX = (stopX - startX) / timeout;
                    var directionY = (stopY - startY)/timeout;

                    unit.showArrow = true;

                    SoundManager.playSound('arrow_shoot');

                    newAnimation = setInterval(function () {

                        unit.arrowLeft = (directionX)*newAnimationTick;
                        unit.arrowTop = (directionY)*newAnimationTick;

                        newAnimationTick++;

                        if (newAnimationTick > timeout) {
                            clearInterval(newAnimation);

                            SoundManager.playSound('arrow_hit');
                            attacker.attackUnit(defender, 'range');
                            defender.defendUnit(attacker, 'range');

                            unit.arrowLeft = 0;
                            unit.arrowTop = 0;
                            unit.showArrow = false;
                            unit.moving = false;
                            callback(unit, this);
                        }
                    }, 5);
                }else {

                    SoundManager.playSound('sword_attack');
                    attacker.attackUnit(defender);
                    defender.defendUnit(attacker);

                    newAnimation = setInterval(function () {
                        var timeout = 100;
                        var left = 1;
                        var top = 1;

                        if (newAnimationTick > Math.floor(timeout / 3)) {
                            left = -1;
                            top = -1;
                        }

                        if (unit.y == y && unit.x < x) {
                            unit.left += 1 * left;
                        }

                        if (unit.y == y && unit.x > x) {
                            unit.left -= 1 * left;
                        }

                        if ((unit.y < y && unit.x == x && unit.y % 2 == 0) || (unit.y < y && unit.x > x && unit.y % 2 != 0)) {
                            unit.left -= 0.55 * left;
                            unit.top += 1 * top;
                            timeout = 90;
                        }

                        if ((unit.y < y && unit.x < x && unit.y % 2 == 0) || (unit.y < y && unit.x == x && unit.y % 2 != 0)) {
                            unit.left += 0.55 * left;
                            unit.top += 1 * top;
                            timeout = 90;
                        }

                        if ((unit.y > y && unit.x == x && unit.y % 2 == 0) || (unit.y > y && unit.x > x && unit.y % 2 != 0)) {
                            unit.left -= 0.55 * left;
                            unit.top -= 1 * top;
                            timeout = 90;
                        }

                        if ((unit.y > y && unit.x < x && unit.y % 2 == 0) || (unit.y > y && unit.x == x && unit.y % 2 != 0)) {
                            unit.left += 0.55 * left;
                            unit.top -= 1 * top;
                            timeout = 90;
                        }

                        newAnimationTick++;

                        if (Math.random() * 100 < 15)
                            unit.rotation = Math.floor((Math.random() - 0.5) * 15);

                        if (newAnimationTick > timeout / (3 / 2)) {
                            clearInterval(newAnimation);

                            unit.rotation = 0;
                            unit.left = 0;
                            unit.top = 0;
                            unit.moving = false;

                            callback(unit, this);
                        }
                    }, 5);
                }


            },
            selectHex: function (unitX, unitY, unit) {

                if (!this.playerTurn) return;

                if (this.selectedUnit != undefined && !this.selectedUnit.moving && this.selectedUnit.movable && this.selectedUnit.ap > 0) {
                    if (unit == undefined) {
                        if (!this.makeUnitMove(this.selectedUnit, unitX, unitY)) {
                            this.selectedUnit = undefined;
                            this.selectedX = undefined;
                            this.selectedY = undefined;
                        }
                    } else if (unit != undefined && this.selectedUnit.party != unit.party && unit.party != undefined) {
                        this.makeUnitAttack(this.selectedUnit, unit);
                        return;
                    }

                    if (this.selectedUnit != undefined && this.selectedUnit.ap == 0) {
                        this.selectedUnit = undefined;
                        this.selectedX = undefined;
                        this.selectedY = undefined;
                    } else if (unit != undefined && unit.movable){
                        this.selectedX = unitX;
                        this.selectedY = unitY;
                    }

                }

                if(this.selectedUnit == unit){
                    this.selectedX = undefined;
                    this.selectedY = undefined;
                    this.selectedUnit = undefined;
                }else if(unit != undefined && unit.movable){
                    this.selectedX = unitX;
                    this.selectedY = unitY;
                    this.selectedUnit = unit;
                }



            },
            makeUnitMove: function (unit,x,y, callback) {
                callback = callback || function (){};

                if (!this.canJump(unit,x,y)) return false;

                var newAnimation = undefined;
                var newAnimationTick = 0;

                unit.moving = true;

                SoundManager.playSound('foot_steps');

                newAnimation = setInterval(function () {
                    var timeout = 100;
                    if (unit.y == y && unit.x < x){
                        unit.left += 1;
                    }

                    if (unit.y == y && unit.x > x){
                        unit.left -= 1;
                    }

                    if ((unit.y < y && unit.x == x && unit.y%2 == 0) || (unit.y < y && unit.x > x && unit.y%2 != 0)){
                        unit.left -= 0.55;
                        unit.top += 1;
                        timeout = 90;
                    }

                    if ((unit.y < y && unit.x < x && unit.y%2 == 0) || (unit.y < y && unit.x == x && unit.y%2 != 0)){
                        unit.left += 0.55;
                        unit.top += 1;
                        timeout = 90;
                    }

                    if ((unit.y > y && unit.x == x && unit.y%2 == 0) || (unit.y > y && unit.x > x && unit.y%2 != 0)){
                        unit.left -= 0.55;
                        unit.top -= 1;
                        timeout = 90;
                    }

                    if ((unit.y > y && unit.x < x && unit.y%2 == 0) || (unit.y > y && unit.x == x && unit.y%2 != 0)){
                        unit.left += 0.55;
                        unit.top -= 1;
                        timeout = 90;
                    }


                    newAnimationTick ++;

                    if (Math.random()*100<15)
                        unit.rotation = Math.floor((Math.random()-0.5)*15)+5;

                    if (newAnimationTick>timeout){
                        clearInterval(newAnimation);
                        unit.ap --;
                        unit.x = x;
                        unit.y = y;
                        unit.rotation = 0;
                        unit.left = 0;
                        unit.top = 0;
                        unit.moving = false;

                        callback(unit, this);
                    }
                }, 5);

                return true;
            },
            moveCursor: function (event) {
                this.cursorX = event.pageX;
                this.cursorY = event.pageY;
            },
            calculateStats: function () {
                if (this.map != undefined) {
                    for (var i = 0; i < this.map.length; i++) {
                        var unitPack = this.map[i];

                        if (unitPack.unit != undefined && unitPack.unit.party != undefined) {
                            unitPack.unit.calculateStats();

                            if (unitPack.unit.rangeAttack) {
                                unitPack.unit.calculateRange(this.map);
                            }
                        }
                    }
                }
            }
        },
        computed:{
            win: function () {
                var win = true;
                for (var i = 0; i < this.enemy.length; i++) {
                    var unit = this.enemy[i];

                    if (unit.health > 0){
                        win = false;
                        break;
                    }
                }

                return win;
            },
            lose: function () {
                var lose = true;
                for (var i = 0; i < this.own.length; i++) {
                    var unit = this.own[i];

                    if (unit.health > 0){
                        lose = false;
                        break;
                    }
                }

                return lose;
            },

            adhesion: function () {
                if (this.selectedUnit != undefined && this.selectedUnit.movable) {
                    return this.selectedUnit.actualAdhesion;
                }else{
                    return {};
                }
            },
            cursor_on_left: function () {
                return (this.cursorX > this.screenX-400 && this.cursorY > this.screenY-390);
            },
            obstaclesMap: function () {
                var obstacles = {};
                for (let i = 0; i < this.obstacles.length; i++) {
                    let obstacle = this.obstacles[i];

                    if (!obstacles.hasOwnProperty(obstacle.x)){
                        obstacles[obstacle.x] = {};
                    }

                    obstacles[obstacle.x][obstacle.y] = obstacle;
                }
                return obstacles;
            },
            ownArmy: function () {
                var army = {};
                for (let i = 0; i < this.own.length; i++) {
                    let unit = this.own[i];


                    if (!army.hasOwnProperty(unit.x)){
                        army[unit.x] = {};
                    }

                    army[unit.x][unit.y] = unit;
                }
                return army;
            },
            enemyArmy: function () {
                var army = {};
                for (let i = 0; i < this.enemy.length; i++) {
                    let unit = this.enemy[i];

                    if (!army.hasOwnProperty(unit.x)){
                        army[unit.x] = {};
                    }

                    army[unit.x][unit.y] = unit;
                }
                return army;
            },
            map: function () {
                var map = [];
                for (let x = 0; x<this.x;x++){
                    for (let y = 0; y<this.y;y++){
                        let left = x * this.sizeX;
                        if (y%2 == 0) left+= this.sizeX/2;

                        let unit = {
                            x:x,
                            y:y,
                            left:left,
                            top:y*this.sizeY,
                            unit:undefined,
                            adhesion:{},
                            can:{left: 'move', right: 'move', leftup: 'move', rightup: 'move', leftdown: 'move', rightdown: 'move'}
                        };



                        if (this.ownArmy[x] != undefined && this.ownArmy[x][y] != undefined){
                            unit.unit = this.ownArmy[x][y];
                            unit.unitType = 'own';
                        }

                        if (this.obstaclesMap[x] != undefined && this.obstaclesMap[x][y] != undefined){
                            unit.unit = this.obstaclesMap[x][y];
                            unit.unitType = 'obstacle';
                        }

                        if (this.enemyArmy[x] != undefined && this.enemyArmy[x][y] != undefined){
                            unit.unit = this.enemyArmy[x][y];
                            unit.unitType = 'enemy';
                        }

//                        if (unit.unit != undefined && unit.unit instanceof Unit && unit.unit.health<=0){
//                            unit.unit = undefined;
//                            unit.unitType = undefined;
//                        }
                        map.push(unit);
                    }
                }

                for (var i = 0; i < map.length; i++) {
                    var unitPack = map[i];

                    if (unitPack.unit != undefined && unitPack.unit.party != undefined) {

                        var can = {left: 'move', right: 'move', leftup: 'move', rightup: 'move', leftdown: 'move', rightdown: 'move'};

                        if (unitPack.x == 0) {
                            can.left = false;
                            if (unitPack.y % 2 != 0) {
                                can.leftup = false;
                                can.leftdown = false;
                            }
                        }

                        if (unitPack.y == 0) {
                            can.leftup = false;
                            can.rightup = false;
                        }

                        if (unitPack.y == this.y - 1) {
                            can.leftdown = false;
                            can.rightdown = false;
                        }

                        if (unitPack.x == this.x - 1) {
                            can.right = false;
                            if (unitPack.y % 2 == 0) {
                                can.rightup = false;
                                can.rightdown = false;
                            }
                        }

                        if (this.ownArmy[unitPack.x - 1] != undefined && this.ownArmy[unitPack.x - 1][unitPack.y] != undefined) can.left = 'own';
                        if (this.ownArmy[unitPack.x + 1] != undefined && this.ownArmy[unitPack.x + 1][unitPack.y] != undefined) can.right = 'own';

                        if (unitPack.y % 2 != 0 && this.ownArmy[unitPack.x - 1] != undefined && this.ownArmy[unitPack.x - 1][unitPack.y - 1] != undefined) can.leftup = 'own';
                        if (unitPack.y % 2 == 0 && this.ownArmy[unitPack.x] != undefined && this.ownArmy[unitPack.x][unitPack.y - 1] != undefined) can.leftup = 'own';

                        if (unitPack.y % 2 != 0 && this.ownArmy[unitPack.x] != undefined && this.ownArmy[unitPack.x][unitPack.y - 1] != undefined) can.rightup = 'own';
                        if (unitPack.y % 2 == 0 && this.ownArmy[unitPack.x + 1] != undefined && this.ownArmy[unitPack.x + 1][unitPack.y - 1] != undefined) can.rightup = 'own';

                        if (unitPack.y % 2 != 0 && this.ownArmy[unitPack.x - 1] != undefined && this.ownArmy[unitPack.x - 1][unitPack.y + 1] != undefined) can.leftdown = 'own';
                        if (unitPack.y % 2 == 0 && this.ownArmy[unitPack.x] != undefined && this.ownArmy[unitPack.x][unitPack.y + 1] != undefined) can.leftdown = 'own';

                        if (unitPack.y % 2 != 0 && this.ownArmy[unitPack.x] != undefined && this.ownArmy[unitPack.x][unitPack.y + 1] != undefined) can.rightdown = 'own';
                        if (unitPack.y % 2 == 0 && this.ownArmy[unitPack.x + 1] != undefined && this.ownArmy[unitPack.x + 1][unitPack.y + 1] != undefined) can.rightdown = 'own';

                        if (this.obstaclesMap[unitPack.x - 1] != undefined && this.obstaclesMap[unitPack.x - 1][unitPack.y] != undefined) can.left = this.obstaclesMap[unitPack.x - 1][unitPack.y].type;
                        if (this.obstaclesMap[unitPack.x + 1] != undefined && this.obstaclesMap[unitPack.x + 1][unitPack.y] != undefined) can.right = this.obstaclesMap[unitPack.x + 1][unitPack.y].type;

                        if (unitPack.y % 2 != 0 && this.obstaclesMap[unitPack.x - 1] != undefined && this.obstaclesMap[unitPack.x - 1][unitPack.y - 1] != undefined) can.leftup = this.obstaclesMap[unitPack.x - 1][unitPack.y - 1].type;
                        if (unitPack.y % 2 == 0 && this.obstaclesMap[unitPack.x] != undefined && this.obstaclesMap[unitPack.x][unitPack.y - 1] != undefined) can.leftup = this.obstaclesMap[unitPack.x][unitPack.y - 1].type;

                        if (unitPack.y % 2 != 0 && this.obstaclesMap[unitPack.x] != undefined && this.obstaclesMap[unitPack.x][unitPack.y - 1] != undefined) can.rightup = this.obstaclesMap[unitPack.x][unitPack.y - 1].type;
                        if (unitPack.y % 2 == 0 && this.obstaclesMap[unitPack.x + 1] != undefined && this.obstaclesMap[unitPack.x + 1][unitPack.y - 1] != undefined) can.rightup = this.obstaclesMap[unitPack.x + 1][unitPack.y - 1].type;

                        if (unitPack.y % 2 != 0 && this.obstaclesMap[unitPack.x - 1] != undefined && this.obstaclesMap[unitPack.x - 1][unitPack.y + 1] != undefined) can.leftdown = this.obstaclesMap[unitPack.x - 1][unitPack.y + 1].type;
                        if (unitPack.y % 2 == 0 && this.obstaclesMap[unitPack.x] != undefined && this.obstaclesMap[unitPack.x][unitPack.y + 1] != undefined) can.leftdown = this.obstaclesMap[unitPack.x][unitPack.y + 1].type;

                        if (unitPack.y % 2 != 0 && this.obstaclesMap[unitPack.x] != undefined && this.obstaclesMap[unitPack.x][unitPack.y + 1] != undefined) can.rightdown = this.obstaclesMap[unitPack.x][unitPack.y + 1].type;
                        if (unitPack.y % 2 == 0 && this.obstaclesMap[unitPack.x + 1] != undefined && this.obstaclesMap[unitPack.x + 1][unitPack.y + 1] != undefined) can.rightdown = this.obstaclesMap[unitPack.x + 1][unitPack.y + 1].type;

                        if (this.enemyArmy[unitPack.x - 1] != undefined && this.enemyArmy[unitPack.x - 1][unitPack.y] != undefined) can.left = 'enemy';
                        if (this.enemyArmy[unitPack.x + 1] != undefined && this.enemyArmy[unitPack.x + 1][unitPack.y] != undefined) can.right = 'enemy';

                        if (unitPack.y % 2 != 0 && this.enemyArmy[unitPack.x - 1] != undefined && this.enemyArmy[unitPack.x - 1][unitPack.y - 1] != undefined) can.leftup = 'enemy';
                        if (unitPack.y % 2 == 0 && this.enemyArmy[unitPack.x] != undefined && this.enemyArmy[unitPack.x][unitPack.y - 1] != undefined) can.leftup = 'enemy';

                        if (unitPack.y % 2 != 0 && this.enemyArmy[unitPack.x] != undefined && this.enemyArmy[unitPack.x][unitPack.y - 1] != undefined) can.rightup = 'enemy';
                        if (unitPack.y % 2 == 0 && this.enemyArmy[unitPack.x + 1] != undefined && this.enemyArmy[unitPack.x + 1][unitPack.y - 1] != undefined) can.rightup = 'enemy';

                        if (unitPack.y % 2 != 0 && this.enemyArmy[unitPack.x - 1] != undefined && this.enemyArmy[unitPack.x - 1][unitPack.y + 1] != undefined) can.leftdown = 'enemy';
                        if (unitPack.y % 2 == 0 && this.enemyArmy[unitPack.x] != undefined && this.enemyArmy[unitPack.x][unitPack.y + 1] != undefined) can.leftdown = 'enemy';

                        if (unitPack.y % 2 != 0 && this.enemyArmy[unitPack.x] != undefined && this.enemyArmy[unitPack.x][unitPack.y + 1] != undefined) can.rightdown = 'enemy';
                        if (unitPack.y % 2 == 0 && this.enemyArmy[unitPack.x + 1] != undefined && this.enemyArmy[unitPack.x + 1][unitPack.y + 1] != undefined) can.rightdown = 'enemy';


                        unitPack.can = can;

                        if (unitPack.unit != undefined && unitPack.unit instanceof Unit) {
                            unitPack.adhesion = unitPack.unit.getAdhesion(can);
                            unitPack.unit.adhesion = unitPack.adhesion;

                        } else {
                            unitPack.adhesion = {};
                        }
                    }
                }
                return map;
            }
        },
        watch:{
            win: function () {
                this.selectedUnit = undefined;
                setTimeout(function () {
                    SoundManager.playSound('win')
                }, 500);

            },
            lose: function () {
                this.selectedUnit = undefined;
                setTimeout(function () {
                    SoundManager.playSound('lose')
                }, 500);

            },
            map:function(){
                this.calculateStats();
            },
            playerTurn: function () {
                if (this.playerTurn) {
                    var that = this;
                    this.showMyTurn = true;
                    setTimeout(function () {
                        that.showMyTurn = false;
                    }, 1500);
                }
            },
            cursor_on_left: function (val) {
                if (val && this.selectedUnit != undefined)
                SoundManager.playSound('whoosh');
            }
        },
        vuex: {
            getters: {
            }
        },
        events: {
            keyup: function (code) {
                if (code == 27){
                    this.showOptions();
                }else if (code == 32){
                    this.nextTurn();
                }
            }
        },
        created: function () {
            var that = this;
            Vue.nextTick(function () {

                var body = $('body');
                var width = body.width();
                var height = body.height();
                that.screenX = (width);
                that.screenY = (height);

                var leftMax = (that.x+1)*that.sizeX-width-50;
                var topMax = (that.y+1)*that.sizeY-height-40;
                var topMin = 20;

                if (leftMax<=0) leftMax = 0;
                if (topMax<=0) topMax = -20;
                if (topMax<=0) topMin = 20;

                $('#map').draggable({
                    containment: [-leftMax ,-topMax, 0,topMin]
                });
                that.startIntro = true;
                SoundManager.playSound('whoosh_start');
                setTimeout(function () {
                    that.startIntro = false;
                }, 1500);

                that.calculateStats();
            })
        }
    }
</script>

<style scoped lang="scss" src="./battle.scss"></style>