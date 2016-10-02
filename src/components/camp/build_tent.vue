<template>
    <div class="tent_container" @click="outerClick" outer-click="true">
        <div class="build_tent">

            <div class="portrait">
                <div class="single_all" :class="[type]"></div>
            </div>
            <div class="stats">
                <div class="information">
                    <div class="icon small sword"></div>
                    {{ units_data[type].attack }}
                </div>
                <div class="information">
                    <div class="icon small shield"></div>
                    {{ units_data[type].defence }}
                </div>
                <div class="information big">
                    <div class="icon small boots"></div>
                    {{ units_data[type].speed }}%
                </div>
                <div class="information">
                    <div class="icon small arrow"></div>
                    {{ units_data[type].ap }}
                </div>
                <div class="information medium">
                    <div class="icon small heart"></div>
                    {{ units_data[type].hp }}
                </div>
            </div>
            <div class="name">{{ units_data[type].name }}</div>
            <div class="select">
                <div class="info">Choose class</div>
                <div v-for="unit_type in units" track-by="$index" class="upgrade"
                     :class="{plus:unit_type == type}"
                     @click="selectType(unit_type)">{{ units_data[unit_type].name }}</div>
            </div>
            <div class="ok" @click="buildAction"></div>
            <div class="cancel" @click="cancelAction"></div>
            <div class="cost">
                <div>
                    <div class="coins"></div>
                    <div class="amount">{{ cost }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import actions from '../../vuex/actions'
    import getters from '../../vuex/getters'
    import map from '../../map'
    import {units} from '../../components/battle/unit'
    import Unit from '../../components/battle/unit'
    import SoundManager from '../../sound/manager'

    export default {
        props:['x','y'],
        data: function () {
            return {
                type:'swordman',
                level:1,
                units:['swordman','archer','cavalry','axemen'],
                units_data: units
            }
        },
        methods:{
            selectType: function (unit_type) {
                this.type = unit_type;
            },
            buildAction: function () {
                this.$parent.buildTent(this.x,this.y,this.type,this.level);
            },
            cancelAction: function () {
                this.$parent.cancelBuildTent();
            },
            outerClick: function (e) {
                if (e.target.getAttribute('outer-click')){
                    this.cancelAction();
                }
            }
        },
        computed: {
            cost: function () {
                var unit = this.units_data[this.type];
                return Math.round(Math.round(unit.hp+(unit.attack+unit.defence+unit.speed/10)*unit.ap)/5)*5;
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
            type: function () {
                SoundManager.playSound('whoosh');

            }
        },
        created: function () {
            SoundManager.playRandomTaunt();
        }
    }
</script>

<style scoped lang="scss" src="./tent.scss"></style>
