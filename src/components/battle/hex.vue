<template>
    <div :style="{top:unit.top+'px',left:unit.left+'px',transform:'rotate('+unit.rotation+'deg)'}" class="hex_image">

        <div v-if="selected && unit.movable && !unit.moving" v-show="playerTurn" transition_off="opacity2" :class="{used:unit.ap == 0}">
            <div class="move_arrow move leftup" v-if="can.leftup == 'move'"></div>
            <div class="move_arrow move rightup" v-if="can.rightup == 'move'"></div>
            <div class="move_arrow move leftdown" v-if="can.leftdown == 'move'"></div>
            <div class="move_arrow move rightdown" v-if="can.rightdown == 'move'"></div>
            <div class="move_arrow move left" v-if="can.left == 'move'"></div>
            <div class="move_arrow move right" v-if="can.right == 'move'"></div>

            <div class="move_arrow enemy leftup" v-if="can.leftup == 'enemy'"></div>
            <div class="move_arrow enemy rightup" v-if="can.rightup == 'enemy'"></div>
            <div class="move_arrow enemy leftdown" v-if="can.leftdown == 'enemy'"></div>
            <div class="move_arrow enemy rightdown" v-if="can.rightdown == 'enemy'"></div>
            <div class="move_arrow enemy left" v-if="can.left == 'enemy'"></div>
            <div class="move_arrow enemy right" v-if="can.right == 'enemy'"></div>

        </div>

        <div class="adhesion_hex onHover">
            <div v-if="adhesion.forest && !unit.moving" class="icon icon small forest"></div>
            <div v-if="adhesion.rock && !unit.moving" class="icon icon small rock"></div>
        </div>

        <div class="health" v-if="unit != undefined && unit.party != undefined">
            <div class="heart" :style="{width:health+'px'}"></div>
            <div class="text">{{ unit.health }}</div>
        </div>

        <div :class="{used:unit.ap == 0}">
            <div :style="{top:unit.arrowTop+'px',left:unit.arrowLeft+'px'}" class="arrow_animation" v-if="unit != undefined && unit.showArrow"></div>

            <div :class="{active:selected}" class="unit cavalry" v-if="unit.type == 'cavalry'"></div>
            <div :class="{active:selected}" class="unit axemen" v-if="unit.type == 'axemen'"></div>
            <div :class="{active:selected}" class="unit king" v-if="unit.type == 'king'"></div>
            <div :class="{active:selected}" class="unit swordman" v-if="unit.type == 'swordman'"></div>
            <div :class="{active:selected}" class="unit archer" v-if="unit.type == 'archer'"></div>
            <div :class="{active:selected}" class="unit plague" v-if="unit.type == 'plague'"></div>

            <div class="unit rock" v-if="unit.type == 'rock'"></div>
            <div class="unit forest" v-if="unit.type == 'forest'"></div>

        </div>
        <div v-if="inRange && playerTurn" class="inRange"></div>

        <div v-if="animation.plusAp" class="animation plusAp"></div>
        <div v-if="animation.damage" class="animation damage">
            <div class="animation_info">
                {{ animation.info }}
            </div>
        </div>
        <div v-if="animation.dodge" class="animation dodge">
            <div class="animation_info">
                MISS
            </div>
        </div>

    </div>
</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'

    export default {
        props:['unit', 'can', 'selected', 'hex','player-turn', 'adhesion', 'range'],
        data: function () {
            var that = this;
            return {
                animation:{
                    info:'',
                    plusAp:false,
                    damage:false,
                    dodge:false,
                }
            }
        },
        computed:{
            health: function () {
                if (this.unit != undefined && this.unit.party != undefined) {
                    return (this.unit.health/this.unit.maxHealth) * 40;
                }else{
                    return 0;
                }

            },
            inRange: function () {
                if (this.range != undefined) {
                    for (var i = 0; i < this.range.length; i++) {
                        var unitPack = this.range[i];

                        if (this.unit == unitPack.unit) {
                            return true;
                        }
                    }
                }

                return false;
            }
        },
        methods:{
            runAnimation: function (animationName, info) {
                var newAnimation = undefined;
                var newAnimationTick = 0;
                var that = this;

                that.animation[animationName] = true;
                this.animation.info = info;
                newAnimation = setInterval(function () {
                    var timeout = 60;
                    newAnimationTick ++;

                    if (newAnimationTick>timeout){
                        clearInterval(newAnimation);
                        that.animation[animationName] = false;
                        that.animation.info = '';
                    }
                }, 5);
            }
        },
        watch:{
            'unit.health': function (val, oldVal) {
                if (val < oldVal) {
                    this.runAnimation('damage', '-'+(oldVal-val))
                }
            },
            'unit.ap': function (val, oldVal) {
                if (val > oldVal) {
                    this.runAnimation('plusAp')
                }
            },
            'unit.dodge': function (val, oldVal) {
                if (val > oldVal) {
                    this.runAnimation('dodge')
                }
            }
        },
    }
</script>

<style scoped lang="scss" src="./hex.scss"></style>