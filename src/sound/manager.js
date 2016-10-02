import Music from './music'
import Sound from './sounds'


export default {
    playMusic: function (musicName) {
        Music.play(musicName);
    },
    playSound: function (musicName) {
        Sound.play(musicName);
    },
    muteMusic: function () {
        Music.mute();
    },
    unmuteMusic: function () {
        Music.unmute();
    },
    playRandomTaunt: function () {
        var taunts = ['hai','sir','yes','ja','your_majesty','ready','aim','commands','hmm','move','heh','hello'];

        var randomTaunt = taunts[Math.floor(Math.random()*taunts.length)];

        Sound.play('taunts', randomTaunt);
    },
    playRandomDead: function () {
        var taunts = ['dead2','dead3','dead4','dead5','dead6','dead7','dead8','dead9'];

        var randomTaunt = taunts[Math.floor(Math.random()*taunts.length)];

        Sound.play('taunts', randomTaunt);
    },
    playDead: function () {
        Sound.play('taunts', 'dead1');
    },

}