import {
    /* Optional global mutation types go here */

} from './mutations_type'

import Options from './modules/options'
/*
 Global state
 */
const state = {};

/*
 Global mutations
 */
const mutations = {}


/*
 Importing modules
 */

var modules = {
    Options
}

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    mutations,
    modules
})