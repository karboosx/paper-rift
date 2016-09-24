
export default function (element){
    element.css({
        bottom:-300,
    })

    element.animate({
        bottom:0,
    }, 1000, 'easeOutSine')

}