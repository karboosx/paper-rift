import * as mutations from './mutations_type'
import SoundManager from '../sound/manager'

import config from '../config'

var actions = {
    mute_music: function ({dispatch}) {
        dispatch(mutations.MUSIC_MUTE, true)
        SoundManager.muteMusic();
    },
    unmute_music: function ({dispatch}) {
        dispatch(mutations.MUSIC_MUTE, false)
        SoundManager.unmuteMusic();
    },

    money_inc: function ({dispatch}, amount) {
        dispatch(mutations.MONEY_INC, amount)
    },
    money_dec: function ({dispatch}, amount) {
        console.log(amount)
        dispatch(mutations.MONEY_DEC, amount)
    },

}

export default actions;