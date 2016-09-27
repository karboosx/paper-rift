<template>
    <div class="page">
        <battle :x="x" :y="y" :own="own" :enemy="enemy" :obstacles="obstacles"></battle>
    </div>
</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'
    import Battle from '../components/battle/battle.vue'
    import Unit from '../components/battle/unit'

    function makeMap(x,y,amount, secondAmoint){
        var obstacles = [];
        var obstaclesTypes = ['rock','forest'];

        for (let a=0; a<amount;a++){
            var randX = Math.floor(Math.random()*x);
            var randY = Math.floor(Math.random()*y);
            var obstacleType = obstaclesTypes[Math.floor(Math.random()*2)];

            if (randX == 0) {
                continue;
            }

            if (randX == x) {
                continue;
            }

            obstacles.push({x:randX,y:randY,type:obstacleType});

            for (let s=0; s<secondAmoint;s++){
                var randXplus = Math.floor(Math.random()*2)-1;
                var randYplus = Math.floor(Math.random()*2)-1;

                if (randXplus == 0 && randYplus ==0) continue;
                if (randX+randXplus == 0) {
                    continue;
                }

                if (randX+randXplus == x) {
                    continue;
                }
                obstacles.push({x:randX+randXplus,y:randY+randYplus,type:obstacleType});

            }
        }

        return obstacles;
    }
    export default {
        data: function () {
            var x = 12;
            var y = 7;

            var obstacles = makeMap(x, y, 5,4);

            return {
                x:x,
                y:y,
                own:[
                    new Unit().setPos(0,1).setType('axemen').setParty('player'),
                    new Unit().setPos(0,2).setType('cavalry').setParty('player'),
                    new Unit().setPos(0,3).setType('swordman').setParty('player'),
                    new Unit().setPos(0,4).setType('king').setParty('player'),
                    new Unit().setPos(0,5).setType('archer').setParty('player'),
                ],
                enemy:[
                    new Unit().setPos(3,2).setType('axemen').setParty('enemy').setMovable(false),

                    new Unit().setPos(x-1,1).setType('axemen').setParty('enemy').setMovable(false),
                    new Unit().setPos(x-1,2).setType('cavalry').setParty('enemy').setMovable(false),
                    new Unit().setPos(x-1,3).setType('swordman').setParty('enemy').setMovable(false),
                    new Unit().setPos(x-1,4).setType('king').setParty('enemy').setMovable(false),

//                    new Unit().setPos(8,3).setType('king').setParty('enemy').setMovable(false),
//                    new Unit().setPos(8,4).setType('cavalry').setParty('enemy').setMovable(false),
//                    new Unit().setPos(8,2).setType('cavalry').setParty('enemy').setMovable(false),
//                    new Unit().setPos(8,1).setType('cavalry').setParty('enemy').setMovable(false),
//                    new Unit().setPos(9,1).setType('swordman').setParty('enemy').setMovable(false),
//                    new Unit().setPos(9,2).setType('swordman').setParty('enemy').setMovable(false),
//                    new Unit().setPos(9,3).setType('swordman').setParty('enemy').setMovable(false),
//                    new Unit().setPos(9,4).setType('swordman').setParty('enemy').setMovable(false),
                ],
                obstacles: obstacles
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