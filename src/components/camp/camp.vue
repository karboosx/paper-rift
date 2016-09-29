<template>
    <div class="map" :class="[bgType]">
        <div class="camp row">
            <div class="wall">
                <div class="row full">
                    <div class="tents">
                        <div class="row" v-for="tent_row in tents" track-by="$index">
                            <template v-for="tent in tent_row" track-by="$index">
                                <div v-if="tent != undefined" class="tent"><div class="image" :class="['lvl'+tent.level]"><div class="text">{{ tent.name }}</div></div></div>
                                <div v-else="tent" class="tent"><div class="image free"></div></div>
                            </template>
                        </div>

                    </div>
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
    import Unit from '../../components/battle/unit'

    export default {
        data: function () {
            return {
                tents:[
                        [undefined,undefined,undefined,undefined],
                        [undefined,undefined,undefined,undefined],
                        [undefined,undefined,undefined,undefined],
                        [undefined,undefined,undefined,undefined],
                ]
            }
        },
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
        },
        created: function () {
            this.tents[1][1] = new Unit().setTentPos(1,1).setType('king').setParty('player').setPos(0, 2).setLevel(5);
        }
    }
</script>

<style scoped lang="scss" src="./camp.scss"></style>
