import $ from 'jquery'

var loading = {
    sound:{current:0,count:0},
    music:{current:0,count:0},
    //images:{current:0,count:0},
};

var toLoad={
        sound:false,
        music:false,
        //images:false,
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

function makeProgress() {
    var current = 0;
    var count = 0;
    for (var name in loading) {
        current+=loading[name].current;
        count+=loading[name].count;
    }

    $('#loading_progress').css({width:Math.ceil(current/count*100)+'%'});
}


export default {
    loading: function (name, current, count) {
        loading[name].current = current;
        loading[name].count = count;

        makeProgress();

    },
    loaded: function (name) {
        if (!toLoad[name]){

            toLoad[name] = true;
            if (checkIfAllLoaded()){
                hideLoading();
            }
        }
    }
}