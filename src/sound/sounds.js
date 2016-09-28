import {Howl} from 'howler'

var sounds = {
    sword_attack: {
        src:[require('../assets/sounds/52458__audione__sword-01.mp3')],
    },
    arrow_hit: {
        src:[require('../assets/sounds/349693__drmaysta__arrow-hit.mp3')],
    },
    arrow_shoot: {
        src:[require('../assets/sounds/60030__qubodup__swosh-whoosh-air-cut.mp3')],
    },
    foot_steps: {
        src:[require('../assets/sounds/75263__skiersailor__heavyfootstompsinforest.mp3')],
    },
    unit_death: {
        src:[require('../assets/sounds/173126__replix__death-sound-male.mp3')],
    },
    win: {
        src:[require('../assets/sounds/346379__snv1985__fanfare-short-edit.mp3')],
    },
    lose: {
        src:[require('../assets/sounds/178875__rocotilos__you-lose-evil.mp3')],
    },


};

var musicHowlers = {};

for (let soundName in sounds) {
    musicHowlers[soundName] = new Howl(sounds[soundName]);
}

var manager = {
    sounds: sounds,
    play: function (music) {
        musicHowlers[music].play();
    }
}
export default manager;

