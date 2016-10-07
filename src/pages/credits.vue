<template>
    <div class="page credits">
        <div class="sounds">
            <h1>Sounds</h1>
            <ol >
                <li><A HREF="https://www.freesound.org/people/DrMaysta/sounds/349693/" >arrow hit.wav&quot; by DrMaysta</A>
                <li><A HREF="https://www.freesound.org/people/audione/sounds/52458/" >sword-01.wav&quot; by audione</A>
                <li><A HREF="http://www.freesound.org/people/qubodup/sounds/60030/" >Swosh / Whoosh / Air Cut&quot; by qubodup</A>
                <li><A HREF="https://www.freesound.org/people/skiersailor/sounds/75263/" >HeavyFootStompsInForest.wav&quot; by skiersailor</A>
                <li><A HREF="https://www.freesound.org/people/Replix/sounds/173126/" >Death sound (male)&quot; by Replix</A>
                <li><A HREF="https://www.freesound.org/people/snv1985/sounds/346379/" >Fanfare Short Edit&quot; by snv1985</A>
                <li><A HREF="https://www.freesound.org/people/Rocotilos/sounds/178875/" >&quot;You Lose&quot; - Evil&quot; by Rocotilos</A>
                <li><A HREF="https://www.freesound.org/people/ramsamba/sounds/318687/" >Typewriter Bell.wav&quot; by ramsamba</A>
                <li><A HREF="https://www.freesound.org/people/Halgrimm/sounds/218894/" >human grunts 2&quot; by Halgrimm</A>
                <li><A HREF="https://www.freesound.org/people/Hitrison/sounds/216675/" >Stick-Swoosh Whoosh &quot; by Hitrison</A>
                <li><A HREF="https://www.freesound.org/people/Spennnyyy/sounds/350504/" >Whoosh! There it is!&quot; by Spennnyyy</A>
                <li><A HREF="https://www.freesound.org/people/Dvideoguy/sounds/207782/" >Hammering.wav&quot; by Dvideoguy</A>
                <li><A HREF="https://www.freesound.org/people/flag2/sounds/63318/" >Page Turn - Please Turn Over (PTO) - paper_turn_over.wav&quot; by flag2</A>
                <li><A HREF="https://www.freesound.org/people/Callum_Sharp279/sounds/198449/" >Menu Scroll/ Selection Sound&quot; by Callum_Sharp279</A>
                <li><A HREF="https://www.freesound.org/people/razrox/sounds/197179/" >Paper Crumpled 001&quot; by razrox</A>
                <li><A HREF="https://www.freesound.org/people/freefire66/sounds/175946/" >Horn002.wav&quot; by freefire66</A>
                <li><A HREF="https://www.freesound.org/people/FenrirFangs/sounds/213980/" >coin clatter 2.wav&quot; by FenrirFangs</A>
            </ol>
        </div>
        <div class="music">
            <h1>Music</h1>
            <ol>
                <li>
                    <a href="http://incompetech.com">Crowd Hammer Kevin MacLeod (incompetech.com)</a>
                </li>
                <li>
                    <a href="http://incompetech.com">Curse of the Scarab Kevin MacLeod (incompetech.com)</a>
                </li>
                <li>
                    <a href="http://incompetech.com">Enchanted Valley Kevin MacLeod (incompetech.com)</a>
                </li>
            </ol>
            Licensed under Creative Commons: By Attribution 3.0 License
            http://creativecommons.org/licenses/by/3.0/
        </div>

    </div>
    <options v-if="isOptionsShow"></options>

</template>

<script type="text/babel">

    import Vue from 'vue'
    import $ from 'jquery'
    import OptionsMixin from '../mixins/options'
    import Options from '../components/options/options.vue'

    export default {
        data: function () {
            return {
                isOptionsShow: false,
            }
        },
        mixins:[OptionsMixin],
        components: {
            Options
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

<style lang="scss" src="./index.scss"></style>