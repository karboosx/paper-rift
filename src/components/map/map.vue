<template>
    <div class="map_container" :class="{full : tile_randomize || next_turn}">
        <div class="campaign_map" :style="{width:width_map+'px',height:height_map+'px'}">
            <div class="inner">
                <template v-for="tile in map" track-by="$index">
                    <div class="tile" :class="['rand'+tile.rand, tile.type, tile.highlight]"
                         :style="{left:tile.left+'px', top:tile.top+'px', transform:'rotate('+tile.rot+'deg)'}"
                         @click="moveToTile(tile)">
                        <div class="text" v-if="tile.is_enemy">Level {{ tile.enemyData.level }}</div>

                        <div class="move" v-if="tile.move">
                            <div class="text" v-if="tile.is_enemy">Money {{ tile.enemyData.money }}</div>
                        </div>

                        <div class="hero player" v-if="tile.x == campaign_x && tile.y == campaign_y"></div>
                        <div class="hero enemy" v-if="tile.is_enemy"></div>
                    </div>
                </template>
            </div>
        </div>

    </div>
</template>

<script type="text/babel">
    import actions from '../../vuex/actions'
    import getters from '../../vuex/getters'
    import SoundManager from '../../sound/manager'
    import Vue from 'vue'
    import LoadSave from '../loadsave'

    export default {
        props:['nextturn'],
        data: function () {

            return {
                x:10,
                y:10,
                tile_width:50,
                tile_height:50,
                tile_randomize:true,
                next_turn:false,
                markToMoveX:undefined,
                markToMoveY:undefined,
                markEnemyHighlightX:undefined,
                markEnemyHighlightY:undefined,
                tiles:{
                    grass:{
                        name:'Grass',
                    },
                    lava:{
                        name:'Lava',
                    },
                    mud:{
                        name:'Mud',
                    },
                    water:{
                        name:'Water',
                    },
                }

            }
        },
        methods:{
            moveToTile: function (tile) {
                if (tile.type == 'water' || !tile.move || this.tile_randomize || this.next_turn || this.enemyReady) return;
                var that = this;
                SoundManager.playSound('paper_crumpled');

                var newEnemy = that.generateEnemys();
                if (newEnemy != undefined){
                    this.markEnemyHighlight(newEnemy.x,newEnemy.y);
                }
                this.markToMove(tile.x, tile.y)
                this.next_turn = true;
                setTimeout(function () {
                    that.move(tile.x, tile.y)
                    if (newEnemy != undefined) {
                        that.addNewEnemy(newEnemy.x, newEnemy.y, newEnemy.level, newEnemy.money);
                    }
                    that.$parent.autoSaveGame();
                    SoundManager.playSound('paper_crumpled_2');

                    Vue.nextTick(function () {
                        that.clearEnemyHighlight();
                        that.next_turn = false;
                    })
                }, 600)

            },
            markToMove: function (x,y) {
                this.markToMoveX = x;
                this.markToMoveY = y;
            },
            markEnemyHighlight: function (x,y) {
                this.markEnemyHighlightX = x;
                this.markEnemyHighlightY = y;
            },
            clearEnemyHighlight: function () {
                this.markEnemyHighlightX = undefined;
                this.markEnemyHighlightY = undefined;
            },
            generateEnemys: function () {
                var rand = Math.floor(Math.random()*100);

                if (rand < 30){
                    var rand_X = Math.floor(Math.random()*(this.map_x+1));
                    var rand_Y = Math.floor(Math.random()*(this.map_y+1));

                    for (var i = 0; i < this.enemy_list.length; i++) {
                        var enemy = this.enemy_list[i];
                        if (enemy.x == rand_X && enemy.y == rand_Y){
                            return;
                        }
                    }

                    if (this.campaign_map[rand_Y][rand_X] == 'water'){
                        return;
                    }

                    var ownLength = LoadSave.loadOwn().length;
                    var level = Math.floor(Math.random()*(ownLength+1))+1;
                    var money = (level)*(level)+Math.floor(Math.random()*(level+1))*5+10;
                    console.log(level, money);

                    return {
                        x:rand_X,
                        y:rand_Y,
                        level:level,
                        money:money
                    }
                }
            }
        },
        watch:{
            enemyReady: function (val) {
                this.nextturn = val;
            }
        },
        computed: {
            width_map: function () {
                return this.map_x*this.tile_width;
            },
            height_map: function () {
                return this.map_y*this.tile_height;
            },
            enemyReady: function () {
                if (this.next_turn) return false;
                for (var i = 0; i < this.enemy_list.length; i++) {
                    var enemy = this.enemy_list[i];

                    if (enemy.x == this.campaign_x && enemy.y == this.campaign_y){
                        return true;
                    }
                }

                return false;
            },
            map: function () {
                var map = [];
                for (let x=0; x<this.map_x;x++){
                    for (let y=0; y<this.map_y;y++){

                        let left = x*this.tile_width;
                        let top = y*this.tile_height;

                        let rot = 0;
                        let tileRand = (x*y)%7+1;
                        if (tileRand == 2 || tileRand==3) tileRand =4;
//                        let tileRand = 1;
                        let type = this.campaign_map[y][x];
                        let highlight = (x == this.campaign_x && y == this.campaign_y) ? 'highlight' : '';
                        let enemyHighlight = (x == this.markEnemyHighlightX && y == this.markEnemyHighlightY);

                        let move = (!this.enemyReady && type != 'water' && Math.abs(x-this.campaign_x)<=1 && Math.abs(y-this.campaign_y)<=1 && !(x == this.campaign_x && y == this.campaign_y));
                        move = move || (!this.enemyReady && type != 'water' && Math.abs(x-this.markToMoveX)<=1 && Math.abs(y-this.markToMoveY)<=1);

                        let is_enemy = false;
                        let enemyData = [];
                        for (var i = 0; i < this.enemy_list.length; i++) {
                            var enemy = this.enemy_list[i];
                            if (enemy.x == x && enemy.y ==y){
                                is_enemy = true;
                                enemyData = enemy;
                                break;
                            }
                        }

                        if (this.tile_randomize || (this.next_turn && (move || highlight!='' || enemyHighlight)) ){
                            left =left+Math.floor(Math.random()*100)-50;
                            top = top+Math.floor(Math.random()*100)-50;
                            rot = Math.floor(Math.random()*90)-45;
                        }

                        map.push({x:x,y:y,left:left, top:top, rand:tileRand, rot:rot, type:type, highlight:highlight, move:move, is_enemy:is_enemy, enemyData:enemyData});

                    }
                }

                return map;
            }
        },
        vuex:{

            actions:{
                move: actions.move,
                addNewEnemy: actions.addNewEnemy,
            },
            getters: {
                money: getters.money,
                campaign_map: getters.map,
                enemy_list: getters.enemy_list,
                map_x: getters.map_x,
                map_y: getters.map_y,
                campaign_x: getters.campaign_x,
                campaign_y: getters.campaign_y,
            }
        },
        created: function () {
            var that = this;

            setTimeout(function () {
                that.tile_randomize = false;
            }, 10);
        }
    }
</script>

<style scoped lang="scss" src="./map.scss"></style>
