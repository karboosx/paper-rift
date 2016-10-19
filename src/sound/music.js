import {Howl} from 'howler'
import loading from './loading'

var musics = {
    menu: {
        src:[require('../assets/music/crowd_hammer.mp3')],
        loop:true
    },
    battle: {
        src:[require('../assets/music/curse_of_the_scarab.mp3')],
        volume:0.4,
        loop:true
    },
    camp: {
        src:[require('../assets/music/enchanted_valley.mp3')],
        volume:0.4,
        loop:true
    },
};

var musicHowlers = {};
var loadedMusic = 0;
var musicCount = 0;

function checkIfLoaded(){
    loading.loading('music',loadedMusic,musicCount)
    if (musicCount == loadedMusic){
        loading.loaded('music');
    }
}

for (let musicName in musics) {
    musicCount++;
}

loading.loading('music',loadedMusic,musicCount)

for (let musicName in musics) {

    musics[musicName].onload = function () {
        loadedMusic++;

        checkIfLoaded();
    }

    musicHowlers[musicName] = new Howl(musics[musicName]);
}



var manager = {
    musics: musics,
    stopAllMusic : function () {
        for (let musicName in musicHowlers) {
            musicHowlers[musicName].stop()
        }
    },
    play: function (music) {
        this.stopAllMusic();
        musicHowlers[music].play();
    },
    mute: function () {
        for (let musicName in musicHowlers) {
            musicHowlers[musicName].mute(true)
        }
    },
    unmute: function () {
        for (let musicName in musicHowlers) {
            musicHowlers[musicName].mute(false)
        }
    }
}
export default manager;

