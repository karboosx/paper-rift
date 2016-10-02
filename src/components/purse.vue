<template>
    <div class="purse">
        <div class="text">
            <div>
                <div class="coins"></div>
                <div class="money">{{ money }}</div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import actions from '../vuex/actions'
    import getters from '../vuex/getters'

    export default {
        vuex:{
            actions:{
                mute: actions.mute_music,
                unmute: actions.unmute_music,
            },
            getters: {
                money: getters.money,
            }
        }
    }
</script>

<style scoped lang="scss">
    .purse{
        background: url("../assets/images/gui/purse.png") no-repeat;
        width: 199px;
        height: 155px;
        position: fixed;
        top:10px;
        left:10px;
        z-index: 1000000;
        pointer-events: none;
    }

    .text{
        position: relative;
        transform: rotate(-12deg);
        top: 17px;
        left: 15px;
        z-index: 1000000;
        width: 166px;
        height: 87px;
        text-align: center;
        color: wheat;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
    }

    .coins{
        width: 34px;
        height: 38px;
        background: url("../assets/images/gui/coins.png") no-repeat;
        background-size: cover;
        display: inline-block;
    }

    .money{
        display: inline-block;
        font-size: 38px;
    }

</style>
