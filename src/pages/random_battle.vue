<template>
    <div class="page">
        <battle x="12" y="8" :own="own" :enemy="enemy"></battle>
    </div>
</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'
    import Battle from '../components/battle/battle.vue'
    import Unit from '../components/battle/unit'

    export default {
        data: function () {
            return {
                own:[
                    new Unit().setPos(0,0).setType('axemen').setParty('player'),
                    new Unit().setPos(1,0).setType('cavalry').setParty('player'),
                    new Unit().setPos(1,1).setType('swordman').setParty('player'),
                    new Unit().setPos(0,1).setType('king').setParty('player'),
                ],
                enemy:[
                    {x:6,y:2,type:'king',left:0,top:0,rotation:0, moving:false, hp:10,maxHp:10,attack:10,defence:10,speed:2,ap:1,maxAp:1},
                ]
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