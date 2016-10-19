import loading from './loading'

var images = [

];

var imagesInstances = {};
var loadedImages = 0;
var imagesCount = 0;

function checkIfLoaded(){
    loading.loading('images',loadedImages,imagesCount)
    if (imagesCount == loadedImages){
        loading.loaded('images');
    }
}

imagesCount=images.length;

loading.loading('images',loadedImages,imagesCount)

for (var i = 0; i < images.length; i++) {
    var imageSrc = images[i];
    imagesInstances['image_'+i] = new Image();
    imagesInstances['image_'+i].onload = function() {
        loadedImages++;

        checkIfLoaded();
    };
    imagesInstances['image_'+i].src = imageSrc;

}


var manager = {

}
export default manager;

