<template>
    <div class="page">
        <battle x="12" y="8" :own="own" :enemy="enemy"></battle>
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
                    {x:1,y:1,type:'axemen',left:0,top:0,rotation:0, moving:false, hp:10,maxHp:10,attack:10,defence:10,speed:10,ap:0,maxAp:1},
                    {x:2,y:1,type:'cavalry',left:0,top:0,rotation:0, moving:false, hp:3,maxHp:10,attack:6,defence:5,speed:8,ap:1,maxAp:1},
                    {x:2,y:2,type:'swordman',left:0,top:0,rotation:0, moving:false, hp:2,maxHp:10,attack:15,defence:10,speed:1,ap:1,maxAp:1},
                    {x:1,y:2,type:'king',left:0,top:0,rotation:0, moving:false, hp:10,maxHp:10,attack:10,defence:10,speed:2,ap:1,maxAp:1},
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