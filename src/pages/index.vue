<template>
    <div class="page">
        <div class="menu" id="menu">
            <div class="gui basic two hover center">Start New Game</div>
            <div class="gui basic three hover center">Options</div>
        </div>
        <div class="heroes" id="heroes"></div>
        <div class="logo" id="logo"></div>
    </div>
</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'
    import heroes_splash from '../animations/heroes_splash'
    import logo_splash from '../animations/logo_splash'
    import menu_splash from '../animations/menu_splash'

    export default {
        components: {

        },
        vuex: {
            getters: {
            }
        },
        created: function () {
            Vue.nextTick(function () {
                heroes_splash($('#heroes'));
                logo_splash($('#logo'));
                menu_splash($('#menu'));
            })
        }
    }
</script>

<style src="./index.scss"></style>