var events = {
    plague:{
        makePlague: function (context) {
            var freeSpace = context.freeSpace();

            if (typeof freeSpace == 'object') {
                var level = Math.floor(Math.random() * 4) + 1;
                var newEnemy = {
                    x: freeSpace.x,
                    y: freeSpace.y,
                    level: level,
                    money: level * 200,
                    type: 'plague'
                };
                context.addNewEnemy(newEnemy.x, newEnemy.y, newEnemy.level, newEnemy.money, newEnemy.type);
                context.markEnemyHighlight(newEnemy.x, newEnemy.y);

            }
        },
        start: function (context, event_id) {
            context.showInfo('Plague has begun!',5000);
            this.makePlague(context);
        },
        tick: function (context, event_id) {
            if (context.events[event_id].turn_count <= -10){
                context.showInfo('Plague has ended!',5000);
                context.deleteEvent(event_id);
            }else {
                this.makePlague(context, event_id);
            }
        }
    }
}

export default {
    events:events,
    start: function (name, context, event_id) {
        if (events.hasOwnProperty(name) && events[name].hasOwnProperty('start')){
            events[name].start(context, event_id);
        }
    },
    tick: function (name, context, event_id) {
        if (events.hasOwnProperty(name) && events[name].hasOwnProperty('tick')){
            events[name].tick(context, event_id);
        }
    },

}