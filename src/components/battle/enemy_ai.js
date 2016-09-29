import SoundManager from '../../sound/manager'
import PF from 'pathfinding'

var directions = {
    left:{even:{x:-1, y:0},odd:{x:-1, y:0}},
    right:{even:{x:1, y:0},odd:{x:1, y:0}},
    leftup:{even:{x:0, y:-1},odd:{x:-1, y:-1}},
    rightup:{even:{x:1, y:-1},odd:{x:0, y:-1}},
    rightdown:{even:{x:1, y:1},odd:{x:0, y:1}},
    leftdown:{even:{x:0, y:1},odd:{x:-1, y:1}},
};

export default {
    methods:{
        tickAvailableEnemy: function () {
            var that = this;
            
            if (this.map != undefined) {

                for (var i = 0; i < this.map.length; i++) {
                    let hex = this.map[i];

                    if (hex.unit != undefined && hex.unit.party == 'enemy') {
                        if (hex.unit.ap > 0 && hex.x != -1 && hex.y != -1) {
                            setTimeout(function () {
                                that.tickEnemyHex(hex);
                            }, 50);
                            return true;
                        }
                    }
                }
            }

            this.nextEnemyTurnEnd();
        },

        findPathToHex: function (activeHex, targetHex, nextX, nextY) {
            console.log(activeHex, targetHex, nextX, nextY)
            if (activeHex.x+nextX>=0 && activeHex.y+nextY>=0 && activeHex.x+nextX<=this.x-1 && activeHex.y+nextY<=this.y-1 && this.map != undefined) {
                var grid = new PF.Grid(this.x, this.y);

                for (var i = 0; i < this.map.length; i++) {
                    var hex = this.map[i];

                    if (hex.unit != undefined && hex.unit.type != undefined && hex.x >= 0 && hex.y >= 0) {
                        if (hex != targetHex) {
                            grid.setWalkableAt(hex.x, hex.y, false);
                        }
                        if (hex.unit.party == activeHex.unit.party) {
                            grid.setWalkableAt(hex.x, hex.y, true);
                        }
                    }
                }

                var finder = new PF.AStarFinder({
                });

                //console.info(grid);
                //console.log(activeHex.x+nextX, activeHex.y+nextY, targetHex.x, targetHex.y);
                var path = finder.findPath(activeHex.x+nextX, activeHex.y+nextY, targetHex.x, targetHex.y, grid);

                this.path = path;

                if (path.length>0) {
                    return {
                        path: path, length: path.length
                    }
                }
            }
            return {
                path:[], length:Infinity
            }
        },
        findDirectionToNearestOwn: function (can, activeHex) {
            var bestLength = Infinity;
            var bestDirection = undefined;
            var bestOption = undefined;
            var data = undefined;

            if (activeHex.y%2 == 0){
                var parity = 'even';
            }else{
                parity = 'odd';
            }

            for (var i = 0; i < this.map.length; i++) {
                var hex = this.map[i];

                if (hex.unit != undefined && hex.unit.party == 'player') {
                    for (var direction in directions) {
                        if (activeHex.can[direction] == 'move' || activeHex.can[direction] == 'own'){
                            var nextX = directions[direction][parity].x;
                            var nextY = directions[direction][parity].y;


                            var newPath = this.findPathToHex(activeHex, hex, nextX, nextY);
                            var newLength = newPath.length;

                            //var newLength = hex.unit.distance(activeHex.x+nextX, activeHex.y+nextY);

                                //console.log(newLength);
                            if (newLength<=bestLength){
                                bestLength = newLength;
                                bestDirection = direction;
                                if (activeHex.can[direction] == 'own'){
                                    bestOption = 'attack';
                                    data = hex;
                                }else{
                                    bestOption = 'move';
                                }
                            }
                        }
                    }
                    //
                }
            }
            return {
                length:bestLength,
                direction:bestDirection,
                option:bestOption,
                data:data,
            };
        },

        findUnitToShoot: function (activeHex) {
            var bestHealth = Infinity;
            var bestOption = undefined;
            var data = undefined;

            for (var i = 0; i < this.map.length; i++) {
                var hex = this.map[i];

                if (hex.unit != undefined && hex.unit.party == 'player') {
                    for (var j = 0; j < activeHex.unit.inRange.length; j++) {
                        var unitInRange = activeHex.unit.inRange[j];

                        if (unitInRange.unit == hex.unit){
                            if (unitInRange.unit.health <= bestHealth){
                                bestHealth = unitInRange.unit.health;
                                bestOption = 'attack';
                                data = hex;
                            }
                        }
                    }
                }
            }
            return {
                health:bestHealth,
                option:bestOption,
                data:data,
            };
        },
        tickEnemyHex: function (hex) {
            var that = this;

            //Enemy AI
            if (hex.y%2 == 0){
                var parity = 'even';
            }else{
                parity = 'odd';
            }


            var action = this.findDirectionToNearestOwn(hex.can, hex);

            console.log(action)
            if (hex.unit.rangeAttack) {
                var shoot = this.findUnitToShoot(hex);
                if (shoot.data != undefined){
                    action = shoot;
                }
            }

            if (action.option == 'move'){
                let nextX = directions[action.direction][parity].x;
                let nextY = directions[action.direction][parity].y;

                this.makeUnitMove(hex.unit, hex.unit.x+nextX,hex.unit.y+nextY, function () {
                    return that.tickAvailableEnemy();
                })

            }else if (action.option == 'attack'){
                this.makeUnitAttack(hex.unit, action.data.unit, function () {
                    return that.tickAvailableEnemy();
                })
            }else{
                hex.unit.ap --;
                that.tickAvailableEnemy();
            }

        },
        nextEnemyTurnStart: function () {
            this.playerTurn = false;
            this.tickAvailableEnemy();
        },
        nextEnemyTurnEnd: function () {
            for (var i = 0; i < this.map.length; i++) {
                var hex = this.map[i];

                if (hex.unit != undefined && hex.unit.party == 'enemy')
                    hex.unit.ap = hex.unit.maxAp;
            }

            this.playerTurn = true;

            SoundManager.playSound('turn')
        },
    }
}