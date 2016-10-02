<template>
    <div class="map" :class="[bgType]">
        <div class="camp row">
            <div class="wall">
                <div class="row full">
                    <div class="tents">
                        <div class="row" v-for="tent_row in tents">
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

    <build-tent v-if="showBuildTent" :x="buildTentX" :y="buildTentY"></build-tent>
    <manage-tent v-if="manageTent" :tent.sync="tents[manageTentX][manageTentY]"></manage-tent>
</template>

<script type="text/babel">
    import actions from '../../vuex/actions'
    import getters from '../../vuex/getters'
    import map from '../../map'
    import Unit from '../../components/battle/unit'
    import BuildTent from './build_tent.vue'
    import ManageTent from './manage_tent.vue'
    import SoundManager from '../../sound/manager'

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
            }
        },
        components:{
            BuildTent, ManageTent
        },
        vuex:{
            actions:{
                mute: actions.mute_music,
            },
            getters: {
                campaign_x: getters.campaign_x,
                campaign_y: getters.campaign_y,
            },
        },
        methods:{
            selectTentToBuild: function (x, y) {
                this.buildTentX=x;
                this.buildTentY=y;
            },
            selectTentToManage: function (x, y) {
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
            },
            cancelBuildTent: function () {
                this.buildTentX=undefined;
                this.buildTentY=undefined;
            },
            cancelManageTent: function () {
                this.manageTentX=undefined;
                this.manageTentY=undefined;
            },

        },
        computed:{
            showBuildTent: function () {
                return this.buildTentX != undefined && this.buildTentY != undefined;
            },
            manageTent: function () {
                return this.manageTentX != undefined && this.manageTentY != undefined;
            },
            bgType: function () {
                return map.map[this.campaign_x][this.campaign_y];
            }
        },
        created: function () {
            this.tents[1][1] = new Unit().setTentPos(1,1).setType('king').setParty('player').setPos(0, 2).setLevel(5);
            this.tents[2][1] = new Unit().setTentPos(2,1).setType('swordman').setParty('player').setPos(0, 2).setLevel(2);
        }
    }
</script>

<style scoped lang="scss" src="./camp.scss"></style>
