//// Flatland //// 0.0.* //// March 2017 //// http://flatland.loop.coop/ ///////

//// Node.js: 7.2.0
//// Rhino:   [not tested yet]

//// Windows XP: Firefox 6, Chrome 15 (and probably lower), Opera 12.10
//// Windows 7:  IE 9, Safari 5.1
//// OS X 10.6:  Firefox 6, Chrome 16 (and probably lower), Opera 12, Safari 5.1
//// iOS:        iPad 3rd (iOS 6) Safari, iPad Air (iOS 7) Chrome
//// Android:    Xperia Tipo (Android 4), Pixel XL (Android 7.1)




if ('function' != typeof jQuery) throw Error('jQuery not found')
jQuery( function($) {




test('The Flatland class', () => {
    is('undefined' != typeof Flatland              , 'Flatland isn’t undefined')
    is('function' == typeof Flatland               , 'Flatland is a function')

    is('Flatland' == Flatland.NAME                 , 'NAME as expected')
    is('0.0.' == Flatland.VERSION.slice(0,4)       , 'VERSION as expected')
    is(0 < Flatland.HOMEPAGE.indexOf('://flatland'), 'HOMEPAGE as expected')
})




})
