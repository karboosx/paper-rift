<template>
    <div class="page">
        <div class="menu" id="menu">
            <div class="gui basic two hover center">Start New Game</div>
            <div v-link="{name:'random_battle'}" class="gui basic three hover center">Random Battle</div>
            <div class="gui basic two hover center" @click="showOptions">Options</div>
        </div>
        <div class="heroes" id="heroes"></div>
        <div class="logo" id="logo"></div>
    </div>
    <options v-if="isOptionsShow"></options>
</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'
    import heroes_splash from '../animations/heroes_splash'
    import logo_splash from '../animations/logo_splash'
    import menu_splash from '../animations/menu_splash'
    import OptionsMixin from '../mixins/options'
    import Options from '../components/options/options.vue'

    export default {
        data: function () {
            return {
                isOptionsShow: false
            }
        },
        mixins:[OptionsMixin],
        components: {
            Options
        },
        vuex: {
            getters: {
            }
        },
        events: {
            keyup: function (code) {
                if (code == 27){
                    this.showOptions();
                }
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

<style lang="scss" src="./index.scss"></style>