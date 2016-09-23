
export default function (element){
    element.css({
        bottom:-100,
    })

    element.animate({
        bottom:100,
    }, 1800, 'easeOutBounce')

}