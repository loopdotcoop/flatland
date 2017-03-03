//// Flatland //// 0.0.* //// March 2017 //// http://flatland.loop.coop/ ///////


if ('function' != typeof jQuery) throw Error('jQuery not found')
jQuery( function($) { 'use strict'


//// Create an instance of Flatland with default configuration.
const flatland = new Flatland({ // config
    THREE
  , wrap: $('#dump')[0]
})

const cutout_id = flatland.add({
    class: Flatland.El.Cutout
  , bitmap: 'assets/tree-1024.jpg'
  , svg:    'assets/tree.svg'
})


animate()
function animate () {
    //
    // if (flatland.ids[cutout_id].ref)
    //     flatland.ids[cutout_id].ref.rotation.y += 0.005

    flatland.render()
    requestAnimationFrame(animate)

}



})
