
export default function (element){
    element.css({
        top:-300,
    })

    element.animate({
        top:0,
    }, 1800, 'easeOutBounce')

}