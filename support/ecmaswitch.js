//// ECMASwitch //// 0.0.2 //// February 2017 //// ecmaswitch.oopish.com/ //////

!function (ROOT) { 'use strict'

//// Create the namespace-object if it does not already exist, and add contants.
var ECMASwitch = ROOT.ECMASwitch = ROOT.ECMASwitch || {}
ECMASwitch.NAME     = 'ECMASwitch'
ECMASwitch.VERSION  = '0.0.2'
ECMASwitch.HOMEPAGE = 'http://ecmaswitch.oopish.com/'

//// Polyfill `document` for non-browser contexts.
var d = ROOT.document || {
    cookie: '~0~'
  , write:  NOOP // @todo have Node etc translate `<script>` to `require()` etc
}




//// BEGIN DYNAMIC SECTION /////////////////////////////////////////////////////
//// This dynamic section is kept up to date by ‘ootility/make.js’ /////////////

var projectLC = 'flatland'
var classes = 'App,El,El.Cutout,El.Light,El.Light.Ambient,El.Light.Spot'

//// END DYNAMIC SECTION ///////////////////////////////////////////////////////




//// PUBLIC API

////
ECMASwitch.load = function (path, names) {
    if (! path) throw Error("ECMASwitch.load(): Set `path`, eg './' or '../'")
    var f = ~~d.cookie.split('~')[1] // script format, 0 - 3
      , p = path + ( (3 == f) ? 'src/' : 'dist/' ) // get path to proper format
      , s = // src values
          (1 == f) ? [ // ES5 Minified
            , path + 'lib/traceur-runtime.min.js'
            , p + 'main/' + projectLC + '.5.min.js'
          ]
        : (2 == f) ? [ // ES6 Production
              p + 'main/' + projectLC + '.6.js'
          ]
        : (3 == f) ?   // ES6 Development
              (p+'main/'+classes.replace(/,/g,'.6.js|'+p+'main/')+'.6.js')
             .split('|')
        : [            // ES5 Production (the default, if no cookie’s been set)
            , path + 'lib/traceur-runtime.js'
            , p + 'main/' + projectLC + '.5.js'
          ]
      , B = '<script src="'  // begin
      , E = '"></'+'script>' // end
    names = names || []
    for (var i=0; i<names.length; i++) if (names[i][f]) s.push( names[i][f] )
    s.unshift(path + 'lib/polyfill.js') //@TODO only load for legacy browsers
    s.unshift(path + 'lib/jquery-3.1.1.min.js') // start with jQuery
    d.write(B + s.join(E + B) + E)
}




//// PRIVATE FUNCTIONS

////
function NOOP () {}


}( 'object' == typeof global ? global : this ) // `window` in a browser
