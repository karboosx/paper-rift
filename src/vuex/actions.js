import * as mutations from './mutations_type'
import SoundManager from '../sound/manager'
import LoadSave from '../components/loadsave'

import config from '../config'

var actions = {
    mute_music: function ({dispatch}) {
        dispatch(mutations.MUSIC_MUTE, true)
        window.localStorage.setItem('MUSIC_MUTE', true);
        SoundManager.muteMusic();
    },
    unmute_music: function ({dispatch}) {
        dispatch(mutations.MUSIC_MUTE, false)
        window.localStorage.setItem('MUSIC_MUTE', false);
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
    removeEnemy: function ({dispatch}, id) {
        dispatch(mutations.CAMPAIGN_REMOVE_ENEMY, id)
    },
    saveGame: function ({state}, own, enemy) {
        var game = {
            own: own,
            enemy: enemy,
            x: state.Campaign.x,
            y: state.Campaign.y,
            money: state.Campaign.money,
            campaign_enemy: state.Campaign.enemy,
            events: state.Campaign.events,
        };

        LoadSave.saveGame(game);
    },
    loadGame: function ({dispatch}) {
        var game = LoadSave.loadGame();
        dispatch(mutations.LOAD_GAME, game.x, game.y, game.money, game.campaign_enemy, game.events)
        return game;

    },
    addNewEnemy: function ({dispatch}, x, y, level, money, type) {
        if (type == undefined) type = 'bandit';
        dispatch(mutations.CAMPAIGN_ADD_ENEMY, x, y, level, money, type)

    },
    tickEvent: function ({dispatch}, event_id) {
        dispatch(mutations.TICK_EVENT, event_id)

    },
    deleteEvent: function ({dispatch}, event_id) {
        dispatch(mutations.DELETE_EVENT, event_id)
    },


}

export default actions;