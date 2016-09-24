<template>
    <div :style="{top:unit.top+'px',left:unit.left+'px',transform:'rotate('+unit.rotation+'deg)'}" :class="{used:unit.ap == 0}" class="hex_image">
        <div :class="{active:selected}" class="unit cavalry" v-if="unit.type == 'cavalry'"></div>
        <div :class="{active:selected}" class="unit axemen" v-if="unit.type == 'axemen'"></div>
        <div :class="{active:selected}" class="unit king" v-if="unit.type == 'king'"></div>
        <div :class="{active:selected}" class="unit swordman" v-if="unit.type == 'swordman'"></div>
        {{unitx}}
    </div>
</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'

    export default {
        props:['unit', 'selected'],
        data: function () {
            return {

            }
        },
        methods:{
        },
    }
</script>

<style lang="scss" src="./hex.scss"></style>