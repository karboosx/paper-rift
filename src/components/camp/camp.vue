<template>
    <div class="map" :class="[bgType]">
        <div class="camp row" id="camp">
            <div class="wall">
                <div class="row full">
                    <div class="tents">
                        <div class="tents_column" v-for="tent_row in tents">
                            <template v-for="tent in tent_row">
                                <div v-if="tent.type != undefined" class="tent" transition="opacity"  @click="selectTentToManage(tent.tent_x, tent.tent_y)">
                                    <div class="image" :class="['lvl'+tent.level]">
                                        <div class="text">{{ tent.name }}</div>
                                    </div>
                                </div>
                                <div v-else="tent" class="tent"><div class="image free" @click="selectTentToBuild(tent.tent_x, tent.tent_y)"></div></div>
                            </template>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="ornament top"></div>
    <div class="ornament bottom"></div>
    <div class="battle_container" v-if="nextturn" transition="battle">
        <div class="battle">
            <div class="text">Battle!</div>
            <div class="attack_button" @click="goToBattle"></div>
            <div class="text">Battle!</div>
        </div>
    </div>


    <build-tent v-if="showBuildTent" :x="buildTentX" :y="buildTentY"></build-tent>
    <manage-tent v-if="manageTent" :tent.sync="tents[manageTentX][manageTentY]"></manage-tent>
    <map v-if="showMap" :nextturn.sync="nextturn"></map>
    <div v-if="!nextturn || showMap" class="map_button" @click="toogleMap"></div>

    <!--<div v-for="cloud in clouds" track-by="$index"-->
         <!--class="cloud" :style="{'margin-left':cloud.left+'vw',  'margin-top':cloud.top+'vh', width: cloud.width+'px'}">-->
    <!--</div>-->
</template>

<script type="text/babel">
    import actions from '../../vuex/actions'
    import getters from '../../vuex/getters'
    import map from '../../map'
    import Unit from '../../components/battle/unit'
    import Map from '../../components/map/map.vue'
    import BuildTent from './build_tent.vue'
    import ManageTent from './manage_tent.vue'
    import SoundManager from '../../sound/manager'
    import Vue from 'vue'
    import $ from 'jquery'
    import LoadSave from '../loadsave'

    export default {
        data: function () {
            return {
                tents:[
                        [{tent_y:0,tent_x:0},{tent_y:1,tent_x:0},{tent_y:2,tent_x:0},{tent_y:3,tent_x:0}],
                        [{tent_y:0,tent_x:1},{tent_y:1,tent_x:1},{tent_y:2,tent_x:1},{tent_y:3,tent_x:1}],
                        [{tent_y:0,tent_x:2},{tent_y:1,tent_x:2},{tent_y:2,tent_x:2},{tent_y:3,tent_x:2}],
                        [{tent_y:0,tent_x:3},{tent_y:1,tent_x:3},{tent_y:2,tent_x:3},{tent_y:3,tent_x:3}],
                ],
                buildTentX:undefined,
                buildTentY:undefined,
                manageTentX:undefined,
                manageTentY:undefined,
                showMap:false,
                clickLock:false,
                cloudsLimit:15,
                nextturn:false,
            }
        },
        components:{
            BuildTent, ManageTent, Map
        },
        vuex:{
            actions:{
                mute: actions.mute_music,
                loadGame: actions.loadGame,
                saveGame: actions.saveGame,
            },
            getters: {
                campaign_map: getters.map,
                enemy_list: getters.enemy_list,
                campaign_x: getters.campaign_x,
                campaign_y: getters.campaign_y,
            },
        },
        methods:{
            goToBattle: function () {
                this.autoSaveGame();
                this.$route.router.go({name:'battle'})
            },
            toogleMap: function () {
                this.showMap = !this.showMap;
                SoundManager.playSound('paper_crumpled');
            },
            selectTentToBuild: function (x, y) {
                if (this.clickLock || this.enemyReady) return;
                this.buildTentX=x;
                this.buildTentY=y;
            },
            selectTentToManage: function (x, y) {
                if (this.clickLock || this.enemyReady) return;
                this.manageTentX=x;
                this.manageTentY=y;
                SoundManager.playRandomTaunt();
            },
            buildTent: function (x,y,type,level) {
                var unit = new Unit().setTentPos(x,y).setType(type).setParty('player').setPos(0, 2).setLevel(level);

                this.tents[x][y] = unit;
                this.$set('tents['+x+']['+y+']', unit);

                SoundManager.playSound('hammer')

                this.buildTentX=undefined;
                this.buildTentY=undefined;
                this.autoSaveGame();
            },
            updateTent: function (x,y,type,level, stats) {

                this.tents[x][y].level = level;
                this.$set('tents['+x+']['+y+'].level', this.tents[x][y].level);

                this.tents[x][y].attack = stats.attack;
                this.tents[x][y].defence = stats.defence;
                this.tents[x][y].speed = stats.speed;
                this.tents[x][y].maxHealth = stats.hp;
                this.tents[x][y].health = stats.hp;
                this.tents[x][y].maxAp = stats.ap;
                this.tents[x][y].ap = stats.ap;

                SoundManager.playSound('hammer')

                this.buildTentX=undefined;
                this.buildTentY=undefined;
                this.autoSaveGame();
            },
            cancelBuildTent: function () {
                this.buildTentX=undefined;
                this.buildTentY=undefined;
            },
            cancelManageTent: function () {
                this.manageTentX=undefined;
                this.manageTentY=undefined;
            },
            autoSaveGame: function () {
                var own = [];
                for (var x = 0; x < this.tents.length; x++) {
                    for (var y = 0; y < this.tents[x].length; y++) {
                        var tent = this.tents[x][y];
                        if (tent instanceof Unit){
                            own.push(tent)
                        }
                    }
                }
                console.log(own);

                this.saveGame(own, []);
            }
        },
        watch:{
            nextturn: function () {
                SoundManager.playSound('horn');
            }
        },
        computed:{
            enemyReady: function () {
                for (var i = 0; i < this.enemy_list.length; i++) {
                    var enemy = this.enemy_list[i];

                    if (enemy.x == this.campaign_x && enemy.y == this.campaign_y){
                        return true;
                    }
                }
                return false;
            },
            clouds: function () {
                var clouds = [];

                for (let i=0;i<this.cloudsLimit;i++){
                    clouds.push({
                        left:Math.floor(Math.random()*150)-50,
                        top:Math.floor(Math.random()*100),
                        width:Math.floor(Math.random()*200)+100,
                    });
                }

                return clouds;
            },
            showBuildTent: function () {
                return this.buildTentX != undefined && this.buildTentY != undefined;
            },
            manageTent: function () {
                return this.manageTentX != undefined && this.manageTentY != undefined;
            },
            bgType: function () {
                return this.campaign_map[this.campaign_y][this.campaign_x];
            }
        },
        created: function () {

            var game = this.loadGame();

            for (var i = 0; i < game.own.length; i++) {
                var tent = game.own[i];

                this.tents[tent.tent_x][tent.tent_y] = tent;
                this.$set('tents['+tent.tent_x+']['+tent.tent_y+']', tent);
            }

            var that = this;
            if (that.enemyReady){
                that.$route.router.go({name:'battle'});
            }

            Vue.nextTick(function () {

                var body = $('body');
                var width = body.width();
                var height = body.height();
//                that.screenX = (width);
//                that.screenY = (height);

                var top = height - 4*200-30;

                if (top > 0) top = 20;

                $('#camp').draggable({
                    containment: [0 ,top, 0,20],
                    start: function () {
                        that.clickLock = true;
                    },
                    stop: function () {
                        Vue.nextTick(function () {
                            that.clickLock = false;
                        })
                    }
                })

            })
        }
    }
</script>

<style scoped lang="scss" src="./camp.scss"></style>
