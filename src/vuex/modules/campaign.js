const state = {
    x: 5,
    y: 5,
    money: 1000,
    map: [
        ['grass', 'mud'  , 'mud'  , 'mud'  , 'grass', 'grass', 'mud'  , 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['mud'  , 'mud'  , 'water', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['mud'  , 'water', 'water', 'grass', 'lava' , 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['water', 'water', 'mud'  , 'lava' , 'lava' , 'lava' , 'lava' , 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['water', 'water', 'mud'  , 'lava' , 'lava' , 'grass', 'lava' , 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['water', 'water', 'mud'  , 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['water', 'water', 'water', 'water', 'grass', 'grass', 'water', 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['water', 'water', 'water', 'water', 'grass', 'grass', 'water', 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['water', 'water', 'grass', 'mud'  , 'lava' , 'grass', 'lava' , 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ],
    enemy:[
        {x:4,y:3,level:2}
    ]
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
}

export default {
    state,
    mutations
}