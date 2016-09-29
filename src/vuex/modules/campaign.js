const state = {
    x: 0,
    y: 0,
}

const mutations = {
    CHANGE_POSITION: function (state, x, y) {
        state.x = x;
        state.y = y;
    },

}

export default {
    state,
    mutations
}