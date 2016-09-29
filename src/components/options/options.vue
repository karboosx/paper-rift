<template>
    <div class="options_container">
        <div class="options">
            <div class="gui basic hover two center" v-if="!music_mute" @click="mute">Music ON</div>
            <div class="gui basic hover two center" v-if="music_mute" @click="unmute">Music OFF</div>
        </div>
    </div>
</template>

<script type="text/babel">
    import actions from '../../vuex/actions'
    import getters from '../../vuex/getters'

    export default {
        vuex:{
            actions:{
                mute: actions.mute_music,
                unmute: actions.unmute_music,
            },
            getters: {
                music_mute: getters.music_mute,
            }
        }
    }
</script>

<style scoped lang="scss" src="./options.scss"></style>
