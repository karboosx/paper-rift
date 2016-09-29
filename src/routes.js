import Index from './pages/index.vue'
import RandomBattle from './pages/random_battle.vue'
import Camp from './pages/camp.vue'

var routes = {
    '/': {
        name: 'index',
        component: Index,
        music:'menu'
    },
    '/camp': {
        name: 'camp',
        component: Camp,
        music:'camp'
    },
    '/random_battle': {
        name: 'random_battle',
        component: RandomBattle,
        music:'battle'
    },
};


export default routes