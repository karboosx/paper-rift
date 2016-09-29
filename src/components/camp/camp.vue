<template>
    <div class="map" :class="[bgType]">
        <div class="camp row">
            <div class="wall">
                <div class="row">
                    <div class="tent lvl1">Swordman</div>
                    <div class="tent lvl2">Swordman</div>
                    <div class="tent lvl3">Swordman</div>
                    <div class="tent lvl4">Swordman</div>
                </div>
                <div class="row">
                    <div class="tent king">King</div>
                    <div class="tent lvl1">Swordman</div>
                    <div class="tent lvl1">Swordman</div>
                    <div class="tent lvl1">Swordman</div>
                </div>
                <div class="row">
                    <div class="tent lvl1">Swordman</div>
                    <div class="tent lvl1">Swordman</div>
                    <div class="tent lvl1">Swordman</div>
                    <div class="tent lvl1">Swordman</div>
                </div>
            </div>
        </div>
    </div>
    <div class="ornament top"></div>
    <div class="ornament bottom"></div>
</template>

<script type="text/babel">
    import actions from '../../vuex/actions'
    import getters from '../../vuex/getters'
    import map from '../../map'

    export default {
        vuex:{
            actions:{
                mute: actions.mute_music,
            },
            getters: {
                campaign_x: getters.campaign_x,
                campaign_y: getters.campaign_y,
            },
        },
        computed:{
            bgType: function () {
                return map.map[this.campaign_x][this.campaign_y];
            }
        }
    }
</script>

<style scoped lang="scss" src="./camp.scss"></style>
