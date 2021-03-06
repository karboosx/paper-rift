var getters = {
    music_mute: (state) => state.Options.mute,

    campaign_x: (state) => state.Campaign.x,
    campaign_y: (state) => state.Campaign.y,

    money: (state) => state.Campaign.money,
    map: (state) => state.Campaign.map,
    map_x: (state) => state.Campaign.map[0].length-1,
    map_y: (state) => state.Campaign.map.length-1,
    enemy_list: (state) => state.Campaign.enemy,
    win_price: (state) => state.Campaign.win_price,
    events: (state) => state.Campaign.events,
}

export default getters;