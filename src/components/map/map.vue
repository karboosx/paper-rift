<template>
    <div class="map_container" :class="{full : tile_randomize || next_turn}">
        <div class="campaign_map">
            <div class="inner">
                <template v-for="tile in map" track-by="$index">
                    <div class="tile" :class="['rand'+tile.rand, tile.type, tile.highlight]"
                         :style="{left:tile.left+'px', top:tile.top+'px', transform:'rotate('+tile.rot+'deg)'}"
                         @click="moveToTile(tile)">
                        <div class="text">{{ tiles[tile.type].name }}</div>
                        <div class="move" v-if="tile.move">
                            <div class="text">Can go</div>
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

    export default {
        data: function () {
            return {
                x:10,
                y:10,
                tile_width:45,
                tile_height:45,
                tile_randomize:true,
                next_turn:false,
                markToMoveX:undefined,
                markToMoveY:undefined,
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

                this.markToMove(tile.x, tile.y)
                this.next_turn = true;
                setTimeout(function () {
                    that.move(tile.x, tile.y)
                    SoundManager.playSound('paper_crumpled_2');

                    that.next_turn = false;
                }, 600)

            },
            markToMove: function (x,y) {
                this.markToMoveX = x;
                this.markToMoveY = y;
            }
        },
        computed: {
            enemyReady: function () {
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
                        let type = this.campaign_map[y][x];
                        let highlight = (x == this.campaign_x && y == this.campaign_y) ? 'highlight' : '';

                        let move = (!this.enemyReady && type != 'water' && Math.abs(x-this.campaign_x)<=1 && Math.abs(y-this.campaign_y)<=1 && !(x == this.campaign_x && y == this.campaign_y));
                        move = move || (!this.enemyReady && type != 'water' && Math.abs(x-this.markToMoveX)<=1 && Math.abs(y-this.markToMoveY)<=1);

                        let is_enemy = false;
                        for (var i = 0; i < this.enemy_list.length; i++) {
                            var enemy = this.enemy_list[i];
                            if (enemy.x == x && enemy.y ==y){
                                is_enemy = true;
                            }
                        }

                        if (this.tile_randomize || (this.next_turn && (move || highlight!=''))){
                            left =left+Math.floor(Math.random()*100)-50;
                            top = top+Math.floor(Math.random()*100)-50;
                            rot = Math.floor(Math.random()*90)-45;
                        }

                        map.push({x:x,y:y,left:left, top:top, rand:tileRand, rot:rot, type:type, highlight:highlight, move:move, is_enemy:is_enemy});

                    }
                }

                return map;
            }
        },
        vuex:{

            actions:{
                move: actions.move,
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
