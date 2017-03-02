"use strict";
!function(ROOT) {
  'use strict';
  var NAME = 'Flatland',
      VERSION = '0.0.1',
      HOMEPAGE = 'http://flatland.loop.coop/';
  var Flatland = ROOT.Flatland = ($traceurRuntime.createClass)(function() {
    var config = arguments[0] !== (void 0) ? arguments[0] : {};
    var defaults = {};
    Object.assign(this, defaults, config);
    this.id = 0;
    this.els = [];
    this.ids = {};
    this.focus = 0;
  }, {
    dump: function() {
      var config = arguments[0] !== (void 0) ? arguments[0] : {};
    },
    add: function() {
      var config = arguments[0] !== (void 0) ? arguments[0] : {};
      var id = config.id = this.id++;
      var z = config.z = this.els.length;
      this.ids[id] = this.els[z] = new config.class(config, this);
      return id;
    },
    edit: function() {
      var config = arguments[0] !== (void 0) ? arguments[0] : {};
      var el = this.ids[config.id];
      if (!el)
        return;
      el.edit(config);
    },
    trigger: function(config) {
      var $__3 = this,
          ids = $__3.ids,
          id = $__3.id;
    }
  }, {});
  Flatland.NAME = NAME;
  Flatland.VERSION = VERSION;
  Flatland.HOMEPAGE = HOMEPAGE;
}('object' == (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);
//# sourceURL=<compile-source>




//\\//\\ built by Oopish Make 0.0.9 //\\//\\ http://ootility.oopish.com //\\//\\
