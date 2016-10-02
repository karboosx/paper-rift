<template>
    <div class="tent_container" @click="outerClick" outer-click="true">
        <div class="image">
            <div class="unit_image" :class="[tent.type]"></div>
        </div>
        <div class="image top">
            <div class="unit_image" :class="[tent.type]"></div>
        </div>
        <div class="image right">
            <div class="unit_image" :class="[tent.type]"></div>
        </div>

        <div class="manage_tent_bg">
            <div class="left">
                <div class="info">
                    <div class="center">
                        <input class="input gui basic six" v-model="name">
                        <div class="convenience">
                            <div class="name">Conveniences</div>
                            <div v-for="(convenience, pleasure) in conveniences['lvl'+tent.level]">
                                <div class="convenience_name" :class="{green:pleasure>=0, red:pleasure<0}">
                                    {{ conveniencesNames[convenience] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="stats">
                    <div class="informations">
                        <div class="information center">
                            <div class="icon small sword"></div>
                            {{ tent.attack }}
                        </div>
                        <div class="information center">
                            <div class="icon small shield"></div>
                            {{ tent.defence }}
                        </div>
                        <div class="information center">
                            <div class="icon small boots"></div>
                            {{ tent.speed }}%
                        </div>
                    </div>
                    <div class="informations">
                        <div class="information center">
                            <div class="icon small arrow"></div>
                            {{ tent.maxAp }}
                        </div>
                        <div class="information center">
                            <div class="icon small heart"></div>
                            {{ tent.maxHealth }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="name">Upgrades</div>

                <div v-for="level in levels" track-by="$index" class="upgrade"
                     :class="{have:level.level<=actualLevel, plus:(actualLevel!=newLevel && level.level==newLevel), block:level.level>actualLevel+1}"
                     @click="selectUpgrade(level)">
                    {{ level.name }}
                </div>

                <div class="cost">
                    <div>Cost</div>
                    <div class="coins"></div>
                    <div class="amount">{{ cost }}</div>
                </div>
            </div>
            <div class="ok" @click="saveAction">
            </div>

        </div>
    </div>
</template>

<script type="text/babel">
    import actions from '../../vuex/actions'
    import getters from '../../vuex/getters'
    import map from '../../map'
    import {units, conveniences, conveniencesNames} from '../../components/battle/unit'
    import Unit from '../../components/battle/unit'
    import SoundManager from '../../sound/manager'

    export default {
        props:['tent'],
        data: function () {
            return {
                actualLevel:this.tent.level,
                newLevel:this.tent.level,
                units_data: units,
                name:this.tent.name.slice(),
                conveniences:conveniences,
                conveniencesNames:conveniencesNames,
                levels:[
                    {
                        level:1,
                        name:'Level 1'
                    },
                    {
                        level:2,
                        name:'Level 2'
                    },
                    {
                        level:3,
                        name:'Level 3'
                    },
                    {
                        level:4,
                        name:'Level 4'
                    },
                ]
            }
        },
        methods:{
            selectType: function (unit_type) {
                this.type = unit_type;
            },
            selectUpgrade: function (level) {
                if (level.level == this.newLevel){
                    this.newLevel = this.actualLevel; //cofniecie zniam
                }else{
                    this.newLevel = level.level;
                }
            },
            saveAction: function () {
                //this.$parent.buildTent(this.x,this.y,this.type,this.level);

                this.cancelAction();
            },
            cancelAction: function () {
                this.$parent.cancelManageTent();
            },
            outerClick: function (e) {
                if (e.target.getAttribute('outer-click')){
                    this.cancelAction();
                }
            }
        },
        computed: {
            type: function () {
                return this.tent.type;
            },
            costUnit: function () {
                var unit = this.units_data[this.type];
                return Math.round(Math.round(unit.hp+(unit.attack+unit.defence+unit.speed/10)*unit.ap)/5)*5;
            },
            cost: function () {
                if (this.actualLevel != this.newLevel)
                return ((this.newLevel - this.actualLevel) * this.newLevel)*this.costUnit;
                else return 0;
            }
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
        watch:{
        }
    }
</script>

<style scoped lang="scss" src="./tent.scss"></style>
