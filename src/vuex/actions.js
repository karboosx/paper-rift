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
        dispatch(mutations.MONEY_DEC, amount)
    },
    move: function ({dispatch}, x,y) {
        dispatch(mutations.CAMPAIGN_CHANGE_POSITION, x,y)
    },

}

export default actions;