const state = {
    mute: false,
}

const mutations = {
    MUSIC_MUTE: function (state, mute) {
        state.mute = mute;
    },

}

export default {
    state,
    mutations
}