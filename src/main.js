import $ from 'jquery'
import jqueryUI from '../lib/jquery-ui.min'

import Vue from 'vue'
var VueRouter = require('vue-router')
import store from './vuex/store'
import routes from './routes'
import config from './config'
import SoundManager from './sound/manager'
import actions from './vuex/actions'
import getters from './vuex/getters'

require('./app.scss')

var App = Vue.extend({
    data: function () {
        return {
            config:config
        }
    },
    store,
    components: {
    },
    vuex:{
        actions:{
            mute_music: actions.mute_music,
            unmute_music: actions.unmute_music,
        },
        getters: {
            music_mute: getters.music_mute,
        }
    },
    ready: function () {
        $('.loading').remove();
        $('#app').show();
    },
    methods:{
        keyup: function (event) {
            this.$broadcast('keyup', event.keyCode);
        },
        loadOptions: function () {
            var muteMusic = localStorage.getItem('MUSIC_MUTE');
            if (muteMusic == 'true'){
                this.mute_music();
            }else{
                this.unmute_music();
            }
        }
    },
    created: function () {
        window.addEventListener('keyup', this.keyup);
        this.loadOptions();
    }
})
Vue.use(VueRouter)

var router = new VueRouter({
    hashbang: true,
    //history: true,
    linkActiveClass: 'active',
})

//router.beforeEach(function ({ to, next }) {
//    analytics('page_view', {url:to.path});
//
//    title.noticeNewPage(to.matched[0].handler.title)
//
//    next()
//
//})


if (process.env.NODE_ENV == 'production') {
    Vue.config.debug = false
    Vue.config.async = true
    Vue.config.devtools = false
}else{
    Vue.config.debug = true //false for production
    Vue.config.async = false // true for production
    Vue.config.devtools = true //false in production
}

router.map(routes)

router.beforeEach(function ({ to, next }) {

    if (to.music != undefined) {
        setTimeout(function () {
            SoundManager.playMusic(to.music);
        });
    }

    next()

})

router.redirect({
    '*': '/'
})
router.start(App, '#app')