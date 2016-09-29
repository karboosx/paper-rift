<template>
    <div class="page">
        <camp></camp>
    </div>
    <options v-if="isOptionsShow"></options>
</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'
    import OptionsMixin from '../mixins/options'
    import Options from '../components/options/options.vue'
    import Camp from '../components/camp/camp.vue'

    export default {
        data: function () {
            return {
                isOptionsShow: false
            }
        },
        mixins:[OptionsMixin],
        components: {
            Options, Camp
        },
        vuex: {
            getters: {
            }
        },
        events: {
            keyup: function (code) {
                if (code == 27){
                    this.showOptions();
                }
            }
        },
    }
</script>