const state = {
    x: 5,
    y: 5,
    money: 1000,
    map: [
        ['grass', 'mud'  , 'mud'  , 'mud'  , 'grass', 'grass', 'mud'  , 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['mud'  , 'mud'  , 'water', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['mud'  , 'water', 'water', 'grass', 'lava' , 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['water', 'water', 'grass', 'lava' , 'lava' , 'lava' , 'lava' , 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['water', 'water', 'grass', 'lava' , 'lava' , 'grass', 'lava' , 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['water', 'water', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['water', 'water', 'water', 'water', 'grass', 'grass', 'water', 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['water', 'water', 'water', 'water', 'grass', 'grass', 'water', 'grass', 'grass', 'grass', 'grass', 'grass',  ],
        ['water', 'water', 'grass', 'lava' , 'lava' , 'grass', 'lava' , 'grass', 'grass', 'grass', 'grass', 'grass',  ],
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