<template>
    <div class="page">
        <battle :x="x" :y="y" :own="own" :enemy="enemy" :obstacles="obstacles" :map-type="mapType"></battle>
    </div>
</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'
    import Battle from '../components/battle/battle.vue'
    import Unit from '../components/battle/unit'
    import actions from '../vuex/actions'
    import getters from '../vuex/getters'
    import loadSave from '../components/loadsave'

    function makeMap(x,y,amount, secondAmount){
        var obstacles = [];
        var obstaclesTypes = ['rock','forest'];

        for (let a=0; a<amount;a++){
            var randX = Math.floor(Math.random()*x);
            var randY = Math.floor(Math.random()*y);
            var obstacleType = obstaclesTypes[Math.floor(Math.random()*2)];

            if (randX == 0) {
                continue;
            }

            if (randX == 1) {
                continue;
            }
            if (randX == x-1) {
                continue;
            }

            if (randX == x-2) {
                continue;
            }

            obstacles.push({x:randX,y:randY,type:obstacleType});

            for (let s=0; s<secondAmount;s++){
                var randXplus = Math.floor(Math.random()*2)-1;
                var randYplus = Math.floor(Math.random()*2)-1;

                if (randXplus == 0 && randYplus ==0) continue;
                if (randX+randXplus == 0) {
                    continue;
                }

                if (randX+randXplus == 1) {
                    continue;
                }
                if (randX+randXplus == x-2) {
                    continue;
                }

                if (randX+randXplus == x-2) {
                    continue;
                }
                obstacles.push({x:randX+randXplus,y:randY+randYplus,type:obstacleType});

            }
        }

        return obstacles;
    }

    var x = 12;
    var y = 8;

    function generateEnemy() {
        var enemy = loadSave.loadEnemy();
        if (enemy == undefined){
            return undefined;
        }
        var enemy_available = [];
        if (enemy.type == 'bandit') enemy_available = ['cavalry','swordman','archer','axemen'];
        if (enemy.type == 'plague') enemy_available = ['plague'];

        var enemys = [];

        if (enemy.level > y*2){
            enemy.level = y*2;
        }

        for (let i=0; i<enemy.level; i++){
            let enemy_y = i%y;

            let enemy_x = Math.floor(i/y);
            enemy_x += 1;

            enemys.push(
                    new Unit().setPos(x-enemy_x,enemy_y).setType(enemy_available[Math.floor(Math.random()*enemy_available.length)]).setParty('enemy').setMovable(false)
            );
        }
        console.log(enemys);
        return enemys;
    }

    function generateOwn(){
        var own = loadSave.loadOwn();

        for (var i = 0; i < own.length; i++) {
            var unit = own[i];
            unit.setPos(Math.floor(unit.tent_x/2), unit.tent_y+(unit.tent_x%2)*4);
            unit.ap = unit.maxAp;
        }
        return own;
    }
    export default {
        data: function () {
            var obstacles = makeMap(x, y, 5,1);
            var mapTypes = ['grass','mud','lava'];

            return {
                mapType:loadSave.loadMapType(),
                x:x,
                y:y,
                own:generateOwn(),
                enemy:generateEnemy(),

                obstacles: obstacles
            }
        },
        components: {
            Battle
        },
        vuex: {
            actions:{
                money_inc: actions.money_inc,
            },
            getters: {
                money: getters.money,
                enemy_list: getters.enemy_list,
                campaign_x: getters.campaign_x,
                campaign_y: getters.campaign_y,
            },
        },
        created: function () {
            if (this.enemy == undefined){
                this.$route.router.go({name:'camp'});
            }
        }
    }
</script>

<!--<style src="./index.scss"></style>-->