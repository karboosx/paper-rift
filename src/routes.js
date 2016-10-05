import Index from './pages/index.vue'
import Battle from './pages/battle.vue'
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
    '/battle': {
        name: 'battle',
        component: Battle,
        music:'battle'
    },
};


export default routes