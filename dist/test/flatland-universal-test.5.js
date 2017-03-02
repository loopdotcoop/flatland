"use strict";
if ('function' != typeof jQuery)
  throw Error('jQuery not found');
jQuery(function($) {
  test('The Flatland class', function() {
    is('undefined' != typeof Flatland, 'Flatland isn’t undefined');
    is('function' == typeof Flatland, 'Flatland is a function');
    is('Flatland' == Flatland.NAME, 'NAME as expected');
    is('0.0.' == Flatland.VERSION.slice(0, 4), 'VERSION as expected');
    is(0 < Flatland.HOMEPAGE.indexOf('://flatland'), 'HOMEPAGE as expected');
  });
});
//# sourceURL=<compile-source>




//\\//\\ built by Oopish Make 0.0.9 //\\//\\ http://ootility.oopish.com //\\//\\
