export var map = [
    ['grass', 'mud'  , 'mud'  , 'mud'  , 'grass', 'grass', 'mud'  , 'grass', 'grass', 'grass', 'grass', 'water', 'water', 'water', 'water',  ],
    ['mud'  , 'mud'  , 'water', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'water', 'grass',  ],
    ['mud'  , 'water', 'water', 'grass', 'lava' , 'grass', 'grass', 'grass', 'grass', 'grass', 'lava' , 'grass', 'grass', 'grass', 'grass',  ],
    ['water', 'water', 'mud'  , 'lava' , 'lava' , 'lava' , 'lava' , 'grass', 'grass', 'grass', 'lava' , 'lava' , 'lava',  'grass', 'grass',  ],
    ['water', 'water', 'mud'  , 'lava' , 'lava' , 'grass', 'lava' , 'grass', 'grass', 'grass', 'grass', 'lava' , 'lava',  'grass', 'grass',  ],
    ['water', 'water', 'mud'  , 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'lava' , 'grass', 'grass', 'grass',  ],
    ['water', 'water', 'water', 'water', 'grass', 'grass', 'water', 'grass', 'grass', 'grass', 'mud'  , 'grass', 'grass', 'grass', 'grass',  ],
    ['water', 'water', 'water', 'water', 'grass', 'grass', 'water', 'grass', 'grass', 'grass', 'mud'  , 'mud'  , 'grass', 'grass', 'grass',  ],
    ['water', 'water', 'grass', 'mud'  , 'lava' , 'grass', 'lava' , 'grass', 'grass', 'mud'  , 'mud'  , 'mud'  , 'grass', 'grass', 'grass',  ],
    ['water', 'water', 'water', 'water', 'grass', 'grass', 'water', 'grass', 'grass', 'grass', 'grass', 'mud'  , 'grass', 'grass', 'grass',  ],
    ['water', 'water', 'grass', 'mud'  , 'lava' , 'grass', 'lava' , 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',  ],
];

const state = {
    x: 4,
    y: 4,
    money: 1000,
    map: map,
    enemy:[
        {x:4,y:3,level:2, money:20}
    ],
}

const mutations = {
    CHANGE_POSITION: function (state, x, y) {
        state.x = x;
        state.y = y;
    },
    MONEY_INC: function (state, amount) {
        state.money += amount;
    },
    MONEY_DEC: function (state, amount) {
        state.money -= amount;
    },
    CHANGE_WIN_PRICE: function (state, price) {
        state.win_price = price;
    },
    REMOVE_ENEMY: function (state) {
        var enemys = [];
        for (var i = 0; i < state.enemy.length; i++) {
            var enemy = state.enemy[i];

            if (!(enemy.x == state.x && enemy.y == state.y)){
                enemys.push(enemy);
            }
        }
        state.enemy = enemys;
    },
    ADD_ENEMY: function (state, x, y, level, money) {
        state.enemy.push({
            x,y,level,money
        })
    },
    LOAD_GAME: function (state, x,y,money, enemys) {
        state.enemy = enemys;
        state.x = x;
        state.y = y;
        state.money = money;
    },
}

export default {
    state,
    mutations
}