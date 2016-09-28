import {Howl} from 'howler'

var musics = {
    menu: {
        src:[require('../assets/music/crowd_hammer.mp3')],
        loop:true
    },
    battle: {
        src:[require('../assets/music/curse_of_the_scarab.mp3')],
        loop:true
    },
};

var musicHowlers = {};

for (let musicName in musics) {
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
    }
}
export default manager;

