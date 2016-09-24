
export default function (element){
    element.css({
        bottom:-100,
    })

    element.animate({
        bottom:20,
    }, 1700, 'easeOutBounce')

}