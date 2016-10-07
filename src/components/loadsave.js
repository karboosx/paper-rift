import Unit from './battle/unit'
import {map} from '../vuex/modules/campaign'
import $ from 'jquery'

//window.localStorage.removeItem('game');

export default {
    checkIfGameIsSaved: function () {
        return window.localStorage.getItem('game') != undefined;
    },
    makeJSON: function (object) {
        return JSON.stringify(object);
    },
    createNewGame: function () {
        var newGame = {
            own: [
                new Unit().setTentPos(1, 0).setType('king').setParty('player').setPos(8, 2).setLevel(1).setHealth(5),
            ],
            x: 4,
            y: 4,
            money: 10000,
            campaign_enemy:[
                {x:4,y:3,level:2, money:20},
                {x:10,y:2,level:3, money:40},
                {x:8,y:8,level:2, money:30},
                {x:2,y:5,level:2, money:30},
                {x:12,y:8,level:2, money:30},
            ],
        };

        this.saveGame(newGame);
    },
    saveGame: function (game) {
        window.localStorage.setItem('game', this.makeJSON(game));
    },
    loadGame: function () {
        this.preCheck();

        var game = JSON.parse(window.localStorage.getItem('game'));


        for (let i = 0; i < game.own.length; i++) {
            let ownUnit = game.own[i];
            game.own[i] = $.extend(new Unit(), ownUnit);
        }

        return game;
    },
    preCheck: function () {
        if (!this.checkIfGameIsSaved()){
            this.createNewGame();
        }
    },
    loadMapType :function () {
        var game = this.loadGame();
        return map[game.y][game.x];

    },
    loadOwn: function () {
        var game = this.loadGame();
        return game.own;
    },
    loadEnemy :function () {
        var game = this.loadGame();

        for (var i = 0; i < game.campaign_enemy.length; i++) {
            var enemy = game.campaign_enemy[i];
            if (enemy.x == game.x && enemy.y == game.y){
                return enemy;
            }
        }
    },
}