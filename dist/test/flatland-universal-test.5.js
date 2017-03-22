"use strict";
if ('function' != typeof jQuery)
  throw Error('jQuery not found');
jQuery(function($) {
  test('The Flatland class (universal)', function() {
    is('undefined' != typeof Flatland, 'Flatland isn’t undefined');
    is('function' == typeof Flatland, 'Flatland is a function');
    is('Flatland' == Flatland.NAME, 'NAME as expected');
    is('0.0.' == Flatland.VERSION.slice(0, 4), 'VERSION as expected');
    is(0 < Flatland.HOMEPAGE.indexOf('://flatland'), 'HOMEPAGE as expected');
    is('object' == $traceurRuntime.typeof(new Flatland()), 'constructs an object');
  });
});
if ('function' != typeof jQuery)
  throw Error('jQuery not found');
jQuery(function($) {
  'use strict';
  test('The El class (universal)', function() {
    is('function' == typeof Flatland.El, '`Flatland.El` is a function');
  });
});
if ('function' != typeof jQuery)
  throw Error('jQuery not found');
jQuery(function($) {
  'use strict';
  test('The El.Cutout class (universal)', function() {
    is('function' == typeof Flatland.El.Cutout, '`Flatland.El.Cutout` is a function');
  });
});
if ('function' != typeof jQuery)
  throw Error('jQuery not found');
jQuery(function($) {
  'use strict';
  test('The El.Light class (universal)', function() {
    is('function' == typeof Flatland.El.Light, '`Flatland.El.Light` is a function');
  });
});
if ('function' != typeof jQuery)
  throw Error('jQuery not found');
jQuery(function($) {
  'use strict';
  test('The El.Light.Ambient class (universal)', function() {
    is('function' == typeof Flatland.El.Light.Ambient, '`Flatland.El.Light.Ambient` is a function');
  });
});
if ('function' != typeof jQuery)
  throw Error('jQuery not found');
jQuery(function($) {
  'use strict';
  test('The El.Light.Spot class (universal)', function() {
    is('function' == typeof Flatland.El.Light.Spot, '`Flatland.El.Light.Spot` is a function');
  });
});
//# sourceURL=<compile-source>




//\\//\\ built by Oopish Make 0.0.9 //\\//\\ http://ootility.oopish.com //\\//\\
