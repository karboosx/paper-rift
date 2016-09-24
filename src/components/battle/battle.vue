<template>
    <div>
        <div class="ornament top"></div>
        <div class="ornament bottom"></div>
        <div class="next_turn">
            <div class="gui orange two hover" @click="nextOwnTurn">Next turn </div>
        </div>

        <div class="container">
            <div :style="{width:((x*1+0.5)*sizeX)+'px', height:((y*1.05)*sizeY)+'px'}" class="map">

                <div class="hex" v-for="hex in map" :class="[hex.unitType]" :style="{top:hex.top+'px'}" @click="selectHex(hex.x,hex.y, hex.unit)">
                    <div class="hex_inner" :class="{selected:(hex.x == selectedX && hex.y == selectedY), moving:(hex.unit != undefined && hex.unit.moving)}" :style="{left:hex.left+'px'}">
                        <hex v-if="hex.unit != undefined" :can="hex.can" :unit.sync="hex.unit" :selected="hex.x == selectedX && hex.y == selectedY"></hex>
                    </div>
                </div>

            </div>

            <div class="info" transition="opacity" v-if="selectedUnit != undefined">

                <div class="unit_image" :class="[selectedUnit.type]"></div>

                <div class="gui basic one info_panel">
                    <div class="information big">
                        {{ selectedUnit.name }}
                    </div>
                    <div class="information">
                        <div class="icon small sword"></div>
                        {{ selectedUnit.attack }}
                    </div>
                    <div class="information">
                        <div class="icon small shield"></div>
                        {{ selectedUnit.defence }}
                    </div>
                    <div class="information">
                        <div class="icon small boots"></div>
                        {{ selectedUnit.speed }}%
                    </div>
                    <div class="information">
                        <div class="icon small arrow"></div>
                        {{ selectedUnit.ap }} / {{ selectedUnit.maxAp }}
                    </div>
                    <div class="information medium">
                        <div class="icon small heart"></div>
                        {{ selectedUnit.hp }} / {{ selectedUnit.maxHp }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'
    import Hex from './hex.vue'

    export default {
        name:'battle',
        props:['x','y', 'own','enemy'],
        data: function () {
            return {
                sizeX:100,
                sizeY:90,
                selectedX:undefined,
                selectedY:undefined,
                selectedUnit:undefined,
            }
        },
        components: {
            Hex
        },
        methods:{
            nextOwnTurn: function () {
                for (var i = 0; i < this.own.length; i++) {
                    var unit = this.own[i];
                    unit.ap = unit.maxAp;
                }
            },
            nextEnemyTurn: function () {
                for (var i = 0; i < this.own.length; i++) {
                    var unit = this.own[i];
                    unit.ap = unit.maxAp;
                }
            },
            makeUnitAttack: function () {

            },
            selectHex: function (unitX, unitY, unit) {

                if (this.selectedUnit != undefined && !this.selectedUnit.moving && unit == undefined && this.selectedUnit.ap > 0){
                    if (unit != undefined && unit.party != this.selectedUnit.party){
                        this.makeUnitAttack(this.selectedUnit, unit);
                    }else{
                        this.makeUnitMove(this.selectedUnit, unitX, unitY);
                    }
                    this.selectedX = undefined;
                    this.selectedY = undefined;
                    this.selectedUnit = undefined;

                }else if(this.selectedUnit == unit){
                    this.selectedX = undefined;
                    this.selectedY = undefined;
                    this.selectedUnit = undefined;
                }else{
                    this.selectedX = unitX;
                    this.selectedY = unitY;
                    this.selectedUnit = unit;
                }



            },
            makeUnitMove: function (unit,x,y) {

                var newAnimation = undefined;
                var newAnimationTick = 0;

                unit.moving = true;
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
                    }
                }, 5);

            }
        },
        computed:{
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
                            can:{}
                        };

                        if (this.ownArmy[x] != undefined && this.ownArmy[x][y] != undefined){
                            unit.unit = this.ownArmy[x][y];
                            unit.unitType = 'own';
                        }

                        if (this.enemyArmy[x] != undefined && this.enemyArmy[x][y] != undefined){
                            unit.unit = this.enemyArmy[x][y];
                            unit.unitType = 'enemy';
                        }

                        map.push(unit);
                    }
                }

                for (var i = 0; i < map.length; i++) {
                    var unitPack = map[i];
                    var can = {left:'move', right:'move', leftup:'move', rightup:'move', leftdown:'move', rightdown:'move'};

                    if (unitPack.x==0) {
                        can.left = false;
                        if (unitPack.y%2 != 0){
                            can.leftup = false;
                            can.leftdown = false;
                        }
                    }

                    if (unitPack.y==0) {
                        can.leftup = false;
                        can.rightup = false;
                    }

                    if (unitPack.y==this.y-1) {
                        can.leftdown = false;
                        can.rightdown = false;
                    }

                    if (unitPack.x==this.x-1) {
                        can.right = false;
                        if (unitPack.y%2 == 0){
                            can.rightup = false;
                            can.rightdown = false;
                        }
                    }

                    if (this.ownArmy[unitPack.x-1] != undefined && this.ownArmy[unitPack.x-1][unitPack.y] != undefined) can.left = false;
                    if (this.ownArmy[unitPack.x+1] != undefined && this.ownArmy[unitPack.x+1][unitPack.y] != undefined) can.right = false;

                    if (unitPack.y%2 != 0 && this.ownArmy[unitPack.x-1] != undefined && this.ownArmy[unitPack.x-1][unitPack.y-1] != undefined) can.leftup = false;
                    if (unitPack.y%2 == 0 && this.ownArmy[unitPack.x] != undefined && this.ownArmy[unitPack.x][unitPack.y-1] != undefined) can.leftup = false;

                    if (unitPack.y%2 != 0 && this.ownArmy[unitPack.x] != undefined && this.ownArmy[unitPack.x][unitPack.y-1] != undefined) can.rightup = false;
                    if (unitPack.y%2 == 0 && this.ownArmy[unitPack.x+1] != undefined && this.ownArmy[unitPack.x+1][unitPack.y-1] != undefined) can.rightup = false;

                    if (unitPack.y%2 != 0 && this.ownArmy[unitPack.x-1] != undefined && this.ownArmy[unitPack.x-1][unitPack.y+1] != undefined) can.leftdown = false;
                    if (unitPack.y%2 == 0 && this.ownArmy[unitPack.x] != undefined && this.ownArmy[unitPack.x][unitPack.y+1] != undefined) can.leftdown = false;

                    if (unitPack.y%2 != 0 && this.ownArmy[unitPack.x] != undefined && this.ownArmy[unitPack.x][unitPack.y+1] != undefined) can.rightdown = false;
                    if (unitPack.y%2 == 0 && this.ownArmy[unitPack.x+1] != undefined && this.ownArmy[unitPack.x+1][unitPack.y+1] != undefined) can.rightdown = false;
                    
                    
                    if (this.enemyArmy[unitPack.x-1] != undefined && this.enemyArmy[unitPack.x-1][unitPack.y] != undefined) can.left = 'enemy';
                    if (this.enemyArmy[unitPack.x+1] != undefined && this.enemyArmy[unitPack.x+1][unitPack.y] != undefined) can.right = 'enemy';

                    if (unitPack.y%2 != 0 && this.enemyArmy[unitPack.x-1] != undefined && this.enemyArmy[unitPack.x-1][unitPack.y-1] != undefined) can.leftup = 'enemy';
                    if (unitPack.y%2 == 0 && this.enemyArmy[unitPack.x] != undefined && this.enemyArmy[unitPack.x][unitPack.y-1] != undefined) can.leftup = 'enemy';

                    if (unitPack.y%2 != 0 && this.enemyArmy[unitPack.x] != undefined && this.enemyArmy[unitPack.x][unitPack.y-1] != undefined) can.rightup = 'enemy';
                    if (unitPack.y%2 == 0 && this.enemyArmy[unitPack.x+1] != undefined && this.enemyArmy[unitPack.x+1][unitPack.y-1] != undefined) can.rightup = 'enemy';

                    if (unitPack.y%2 != 0 && this.enemyArmy[unitPack.x-1] != undefined && this.enemyArmy[unitPack.x-1][unitPack.y+1] != undefined) can.leftdown = 'enemy';
                    if (unitPack.y%2 == 0 && this.enemyArmy[unitPack.x] != undefined && this.enemyArmy[unitPack.x][unitPack.y+1] != undefined) can.leftdown = 'enemy';

                    if (unitPack.y%2 != 0 && this.enemyArmy[unitPack.x] != undefined && this.enemyArmy[unitPack.x][unitPack.y+1] != undefined) can.rightdown = 'enemy';
                    if (unitPack.y%2 == 0 && this.enemyArmy[unitPack.x+1] != undefined && this.enemyArmy[unitPack.x+1][unitPack.y+1] != undefined) can.rightdown = 'enemy';

                    

                    unitPack.can = can;
                }
                return map;
            }
        },
        vuex: {
            getters: {
            }
        },
        created: function () {

        }
    }
</script>

<style lang="scss" src="./battle.scss"></style>