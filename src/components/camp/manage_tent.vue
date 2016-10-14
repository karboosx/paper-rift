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
                            <div v-for="(convenience, pleasure) in conveniences['lvl'+newLevel]">
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
                            {{ stats.attack }}
                        </div>
                        <div class="information center">
                            <div class="icon small shield"></div>
                            {{ stats.defence }}
                        </div>
                        <div class="information center">
                            <div class="icon small boots"></div>
                            {{ stats.speed }}%
                        </div>
                    </div>
                    <div class="informations">
                        <div class="information center">
                            <div class="icon small arrow"></div>
                            {{ stats.ap }}
                        </div>
                        <div class="information medium center">
                            <div class="icon small heart"></div>
                            {{ stats.hpNow }}/{{ stats.hp }}
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
            <button class="ok" @click="saveAction" :disabled="money < cost">
            </button>
            <div class="heal" v-if="tent.health<stats.hp && this.actualLevel == this.newLevel" :class="{clicked:heal}" @click="toogleHeal">
                <div class="text">Heal Unit</div>
                <div class="heal_button"></div>
            </div>

        </div>
        <purse></purse>
    </div>
</template>

<script type="text/babel">
    import actions from '../../vuex/actions'
    import getters from '../../vuex/getters'
    import map from '../../map'
    import {units, conveniences, conveniencesNames} from '../../components/battle/unit'
    import Unit from '../../components/battle/unit'
    import SoundManager from '../../sound/manager'
    import Purse from '../../components/purse.vue'

    export default {
        props:['tent'],
        data: function () {
            return {
                actualLevel:this.tent.level,
                newLevel:this.tent.level,
                units_data: units,
                name:this.tent.name.slice(),
                conveniences:conveniences,
                heal:false,
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
        components:{Purse},
        methods:{
            toogleHeal: function () {
                this.heal = !this.heal;

                if (this.heal){
                    SoundManager.playSound('empty_bottle')
                }
            },
            selectType: function (unit_type) {

                SoundManager.playSound('click');
                this.type = unit_type;
            },
            selectUpgrade: function (level) {

                SoundManager.playSound('click');
                if (level.level == this.newLevel){
                    this.newLevel = this.actualLevel; //cofniecie zniam
                }else{
                    this.newLevel = level.level;
                }
            },
            saveAction: function () {

                SoundManager.playSound('click');
                this.tent.name = this.name;
                if (this.money >= this.cost && this.cost > 0) {
                    this.money_dec(this.cost);
                    this.$parent.updateTent(this.tent.tent_x,this.tent.tent_y,this.type,this.newLevel, this.stats, this.heal);
                }
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
            stats: function () {
                var upgrade = 0.2;
                var mult = (this.newLevel-this.actualLevel)*upgrade;

                var stats = {
                    attack:this.tent.attack+Math.round(this.tent.attack*mult),
                    defence:this.tent.defence+Math.ceil(this.tent.defence*mult),
                    speed:this.tent.speed+Math.round(this.tent.speed*mult),
                    hp:this.tent.maxHealth+Math.ceil(this.tent.maxHealth*mult),
                    ap:this.tent.maxAp+Math.floor(this.tent.maxAp*mult),
                };
                stats.hpNow = (!this.heal && this.actualLevel == this.newLevel ? this.tent.health: stats.hp);
                return stats;
            },
            type: function () {
                return this.tent.type;
            },
            costUnit: function () {
                var unit = this.units_data[this.type];
                return Math.round(Math.round(unit.hp+(unit.attack+unit.defence+unit.speed/10)*unit.ap)/5)*5;
            },
            cost: function () {
                var hp =(this.stats.hp);
                var cost = 0;
                if (this.actualLevel != this.newLevel)
                    cost+= ((this.newLevel - this.actualLevel) * this.newLevel)*this.costUnit;


                else if (this.heal && this.tent.health<this.stats.hp)
                    cost+=Math.ceil((this.stats.hp-this.tent.health)*
                            (this.newLevel)*0.2);


                return cost;
            }
        },
        vuex:{
            actions:{

                money_dec: actions.money_dec,
            },
            getters: {
                money: getters.money,
            },
        },
        watch:{
        }
    }
</script>

<style scoped lang="scss" src="./tent.scss"></style>
