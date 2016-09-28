import Index from './pages/index.vue'
import RandomBattle from './pages/random_battle.vue'

var routes = {
    '/': {
        name: 'index',
        component: Index,
        music:'menu'
    },
    '/random_battle': {
        name: 'random_battle',
        component: RandomBattle,
        music:'battle'
    },
};


export default routes