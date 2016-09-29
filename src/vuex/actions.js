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

}

export default actions;