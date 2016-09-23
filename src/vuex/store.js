import {
    /* Optional global mutation types go here */

} from './mutations_type'


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

}

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    mutations,
    modules
})