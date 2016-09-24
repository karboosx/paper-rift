<template>
    <div :style="{top:unit.top+'px',left:unit.left+'px',transform:'rotate('+unit.rotation+'deg)'}" :class="{used:unit.ap == 0}" class="hex_image">
        <div :class="{active:selected}" class="unit cavalry" v-if="unit.type == 'cavalry'"></div>
        <div :class="{active:selected}" class="unit axemen" v-if="unit.type == 'axemen'"></div>
        <div :class="{active:selected}" class="unit king" v-if="unit.type == 'king'"></div>
        <div :class="{active:selected}" class="unit swordman" v-if="unit.type == 'swordman'"></div>

        <div v-if="selected">
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
    </div>
</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'

    export default {
        props:['unit', 'can', 'selected'],
        data: function () {
            return {

            }
        },
        methods:{
        },
    }
</script>

<style lang="scss" src="./hex.scss"></style>