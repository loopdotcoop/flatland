//// Flatland //// 0.0.* //// March 2017 //// http://flatland.loop.coop/ ///////


//// Node.js: 7.2.0
//// Rhino:   [not tested yet]




if ('function' != typeof jQuery) throw Error('jQuery not found')
jQuery( function($) { 'use strict'




test('The El.Light.Ambient class (nonbrowser)', () => {
    is('function' == typeof Flatland.El.Light.Ambient   , '`Flatland.El.Light.Ambient` is a function')
})




})
