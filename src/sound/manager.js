import Music from './music'
import Sound from './sounds'


export default {
    playMusic: function (musicName) {
        Music.play(musicName);
    },
    playSound: function (musicName) {
        Sound.play(musicName);
    }
}