"use strict";
if ('function' != typeof jQuery)
  throw Error('jQuery not found');
jQuery(function($) {
  'use strict';
  var flatland = new Flatland({
    THREE: THREE,
    wrap: $('#dump')[0]
  });
  var cutout_id = flatland.add({
    class: Flatland.El.Cutout,
    bitmap: 'assets/tree-1024.jpg',
    svg: 'assets/tree.svg'
  });
  animate();
  function animate() {
    flatland.render();
    requestAnimationFrame(animate);
  }
});
//# sourceURL=<compile-source>




//\\//\\ built by Oopish Make 0.0.9 //\\//\\ http://ootility.oopish.com //\\//\\
