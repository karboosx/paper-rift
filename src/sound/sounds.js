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
    turn: {
        src:[require('../assets/sounds/318687__ramsamba__typewriter-bell.mp3')],
    },
    whoosh: {
        src:[require('../assets/sounds/350504__spennnyyy__whoosh-there-it-is.mp3')],
    },
    whoosh_start: {
        src:[require('../assets/sounds/216675__hitrison__stick-swoosh-whoosh.mp3')],
    },
    hammer: {
        src:[require('../assets/sounds/207782__dvideoguy__hammering.mp3')],
    },
    taunts: {
        src:[require('../assets/sounds/taunts.mp3')],
        sprite: {
            hai: [0, 556],
            sir: [1085, 609],
            yes: [2619, 582],
            ja: [4339, 873],
            your_majesty: [5689, 1323],
            ready: [8467, 767],
            aim: [10530, 794],
            commands: [12012, 1005],
            hmm: [13758, 688],
            move: [15319, 661],
            heh: [18203, 688],
            hello: [20902, 820],
            dead1:[25956,820],
            dead2:[28099,1058],
            dead3:[29739,1005],
            dead4:[30903,926],
            dead5:[32074,820],
            dead6:[33337,714],
            dead7:[34422,661],
            dead8:[35242,900],
            dead9:[36407,1032],
        },
        volume:0.6,
    },


};

var musicHowlers = {};

for (let soundName in sounds) {
    musicHowlers[soundName] = new Howl(sounds[soundName]);
}

var manager = {
    sounds: sounds,
    play: function (music, sprite) {
        musicHowlers[music].play(sprite);
    },

}
export default manager;

