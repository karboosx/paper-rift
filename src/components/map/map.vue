<template>
    <div class="map_container">
        <div class="campaign_map">
            <div class="inner">
                <template v-for="tile in map" track-by="$index">
                    <div class="tile" :class="['rand'+tile.rand, tile.type]"
                         :style="{left:tile.left+'px', top:tile.top+'px', transform:'rotate('+tile.rot+'deg)'}">
                        <div class="text">{{ tiles[tile.type].name }}</div>

                        <div class="hero player" v-if="tile.x == campaign_x && tile.y == campaign_y"></div>
                    </div>
                </template>
            </div>
        </div>

    </div>
</template>

<script type="text/babel">
    import actions from '../../vuex/actions'
    import getters from '../../vuex/getters'

    export default {
        data: function () {
            return {
                x:10,
                y:10,
                tile_width:45,
                tile_height:45,
                tile_randomize:true,
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
        computed: {
            map: function () {
                var map = [];
                for (let x=0; x<this.map_x;x++){
                    for (let y=0; y<this.map_y;y++){

                        let left = x*this.tile_width-Math.floor(Math.random()*10)+5;
                        let top = y*this.tile_height-Math.floor(Math.random()*10)+5;

                        let rot = Math.floor(Math.random()*6)-3;
                        let tileRand = (x*y)%7+1;
                        let type = this.campaign_map[y][x];

                        if (this.tile_randomize){
                            left =Math.floor(Math.random()*1000)-200;
                            top = Math.floor(Math.random()*1000)-200;
                            rot = Math.floor(Math.random()*90)-45;
                        }

                        map.push({x:x,y:y,left:left, top:top, rand:tileRand, rot:rot, type:type});

                    }
                }

                return map;
            }
        },
        vuex:{

            actions:{
                mute: actions.mute_music,
                unmute: actions.unmute_music,
            },
            getters: {
                money: getters.money,
                campaign_map: getters.map,
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
                console.log(that.map_y);
            }, 10);
        }
    }
</script>

<style scoped lang="scss" src="./map.scss"></style>
