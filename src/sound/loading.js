import $ from 'jquery'

var toLoad={
        sound:false,
        music:false
    };

function checkIfAllLoaded() {
    for (var name in toLoad) {
        if (!toLoad[name]) return false;
    }
    return true;
}

function hideLoading() {
    $('#loading').hide();

}
export default {
    loaded: function (name) {
        if (!toLoad[name]){

            toLoad[name] = true;
            if (checkIfAllLoaded()){
                hideLoading();
            }
        }
    }
}