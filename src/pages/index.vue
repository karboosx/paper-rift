<template>
    <div class="page">
        <div class="menu" id="menu">
            <div v-if="haveGame" v-link="{name:'camp'}" class="gui basic two hover center margindown">Continue Game</div>
            <div @click="newGame" class="gui basic two hover center margindown">Start New Game</div>
            <div class="gui basic two hover center margindown" @click="showOptions">Options</div>
            <div class="gui basic two hover center margindown" v-link="{name:'credits'}">Credits</div>
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
    import LoadSave from '../components/loadsave'

    export default {
        data: function () {
            return {
                isOptionsShow: false,
                haveGame: LoadSave.checkIfGameIsSaved()
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
        methods: {
            newGame: function () {
                LoadSave.createNewGame();
                this.$route.router.go({name:'camp'});
            }
        },
        events: {
            keyup: function (code) {
                console.log(code)
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

<style scoped lang="scss" src="./index.scss"></style>