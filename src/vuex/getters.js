var getters = {
    music_mute: (state) => state.Options.mute,

    campaign_x: (state) => state.Campaign.x,
    campaign_y: (state) => state.Campaign.y,

    money: (state) => state.Campaign.money,
}

export default getters;