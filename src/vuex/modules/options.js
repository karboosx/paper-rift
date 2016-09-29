const state = {
    mute: false,
}

const mutations = {
    MUSIC_MUTE: function (state, mute) {
        state.mute = mute;

        localStorage.setItem("MUSIC_MUTE", mute);
    },

}

export default {
    state,
    mutations
}