<template>
    <div class="page">
        <battle x="8" y="5" :own="own" :enemy="enemy"></battle>
    </div>
</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'
    import Battle from '../components/battle/battle.vue'

    export default {
        data: function () {
            return {
                own:[
                    {x:1,y:1,type:'axemen',left:0,top:0,rotation:0, moving:false},
                    {x:2,y:1,type:'cavalry',left:0,top:0,rotation:0, moving:false},
                    {x:2,y:2,type:'cavalry',left:0,top:0,rotation:0, moving:false},
                ],
                enemy:[]
            }
        },
        components: {
            Battle
        },
        vuex: {
            getters: {
            }
        },
        created: function () {

        }
    }
</script>

<!--<style src="./index.scss"></style>-->