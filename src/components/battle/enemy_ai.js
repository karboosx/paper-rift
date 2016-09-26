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
            for (var i = 0; i < this.map.length; i++) {
                var hex = this.map[i];

                if (hex.unit != undefined && hex.unit.party == 'enemy') {
                    if (hex.unit.ap > 0) {
                        this.tickEnemyHex(hex);
                        return true;
                    }
                }
            }

            this.nextEnemyTurnEnd();
        },

        findDirectionToNearestOwn: function (can, activeHex) {
            var bestLength = Infinity;
            var bestDirection = undefined;
            var bestOption = 'move';
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

                            var newLength = hex.unit.distance(activeHex.x+nextX, activeHex.y+nextY);
                            if (newLength<bestLength){
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
        tickEnemyHex: function (hex) {
            var that = this;

            //Enemy AI
            if (hex.y%2 == 0){
                var parity = 'even';
            }else{
                parity = 'odd';
            }

            var action = this.findDirectionToNearestOwn(hex.can, hex);

            if (action.option == 'move'){
                let nextX = directions[action.direction][parity].x;
                let nextY = directions[action.direction][parity].y;

                this.makeUnitMove(hex.unit, hex.unit.x+nextX,hex.unit.y+nextY, function () {
                    that.tickAvailableEnemy();
                })

            }else if (action.option == 'attack'){
                this.makeUnitAttack(hex.unit, action.data.unit, function () {
                    that.tickAvailableEnemy();
                })
            }

        },
        nextEnemyTurnStart: function () {
            this.tickAvailableEnemy();
        },
        nextEnemyTurnEnd: function () {
            for (var i = 0; i < this.map.length; i++) {
                var hex = this.map[i];

                if (hex.unit != undefined && hex.unit.party == 'enemy')
                    hex.unit.ap = hex.unit.maxAp;
            }
        },
    }
}