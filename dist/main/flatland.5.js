"use strict";
!function(ROOT) {
  'use strict';
  var NAME = 'Flatland',
      VERSION = '0.0.3',
      HOMEPAGE = 'http://flatland.loop.coop/';
  var Flatland = ROOT.Flatland = ($traceurRuntime.createClass)(function() {
    var config = arguments[0] !== (void 0) ? arguments[0] : {};
    var defaults = {
      THREE: Flatland.stubs.THREE,
      originMarkers: false,
      antialias: true,
      wrap: ROOT.document ? ROOT.document.body : Flatland.stubs.body,
      WINDOW: ROOT.innerWidth ? ROOT : Flatland.stubs.window
    };
    defaults.width = defaults.WINDOW.innerWidth;
    defaults.height = defaults.WINDOW.innerHeight;
    Object.assign(this, defaults, config);
    this.id = 0;
    this.els = [];
    this.ids = {};
    this.focus = 0;
    this.materials = {};
    this.geometries = {};
    this.textureLoader = new this.THREE.TextureLoader();
    this.svgLoader = new this.THREE.SVGLoader();
    this.camera = new this.THREE.PerspectiveCamera(25, this.width / this.height, 1, 1000);
    this.camera.position.set(0, 2, 10);
    this.scene = new this.THREE.Scene();
    this.renderer = new this.THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.wrap.appendChild(this.renderer.domElement);
    this.controls = new this.THREE.OrbitControls(this.camera, this.wrap);
    this.add({
      class: Flatland.El.Light.Ambient,
      color: 0xFFFFFF,
      intensity: 0.3
    });
    if (this.originMarkers) {
      var origin = new this.THREE.Mesh(new this.THREE.CubeGeometry(0.1, 0.1, 0.1), new this.THREE.MeshBasicMaterial({color: 0xFFFFFF}));
      origin.position.set(0, 0, 0);
      this.scene.add(origin);
      var x1 = new this.THREE.Mesh(new this.THREE.CubeGeometry(0.1, 0.1, 0.1), new this.THREE.MeshBasicMaterial({color: 0xFF0000}));
      x1.position.set(1, 0, 0);
      this.scene.add(x1);
      var y1 = new this.THREE.Mesh(new this.THREE.CubeGeometry(0.1, 0.1, 0.1), new this.THREE.MeshBasicMaterial({color: 0x00FF00}));
      y1.position.set(0, 1, 0);
      this.scene.add(y1);
      var z1 = new this.THREE.Mesh(new this.THREE.CubeGeometry(0.1, 0.1, 0.1), new this.THREE.MeshBasicMaterial({color: 0x0000FF}));
      z1.position.set(0, 0, 1);
      this.scene.add(z1);
    }
  }, {
    render: function() {
      var config = arguments[0] !== (void 0) ? arguments[0] : {};
      this.renderer.render(this.scene, this.camera);
    },
    add: function() {
      var config = arguments[0] !== (void 0) ? arguments[0] : {};
      var id = config.id = this.id++,
          len = this.els.length,
          el = this.ids[id] = this.els[len] = new config.class(config, this);
      if (el.ref)
        this.scene.add(el.ref);
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
      var $__12 = this,
          ids = $__12.ids,
          id = $__12.id;
    },
    getMaterial: function(path, repeat, luminous) {
      if (this.materials[path])
        return this.materials[path];
      var texture = this.textureLoader.load(path);
      texture.wrapS = texture.wrapT = this.THREE.MirroredRepeatWrapping;
      texture.repeat.set(repeat, repeat);
      if (luminous)
        return this.materials[path] = new this.THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          map: texture,
          wireframe: false
        });
      else
        return this.materials[path] = new this.THREE.MeshLambertMaterial({
          color: 0x999999,
          map: texture,
          wireframe: false
        });
    },
    getGeometry: function(path, callback) {
      var $__11 = this;
      if (this.geometries[path])
        return this.geometries[path];
      this.svgLoader.load(path, function(svgElement) {
        if ('parsererror' === svgElement.tagName)
          return console.warn(("Cannot parse " + path));
        var width = parseInt(svgElement.getAttribute('width')),
            height = parseInt(svgElement.getAttribute('height')),
            points = [];
        if (width !== height)
          return console.warn(("width " + width + " !== height " + height));
        for (var i$__13 = 0,
            node = void 0; node = svgElement.childNodes[i$__13++]; ) {
          if (!node.tagName)
            continue;
          if ('polygon' !== node.tagName.toLowerCase())
            return console.warn((path + " unexpected node.tagName"));
          points.push([]);
          var pairs = node.getAttribute('points').replace(/\s+/g, ' ').replace(/\s+$/, '').split(' ');
          for (var j = 0,
              pair = void 0,
              p = void 0; pair = pairs[j++]; ) {
            p = pair.split(',');
            points[points.length - 1].push(new $__11.THREE.Vector2(p[0] / width - 0.5, -p[1] / width + 1));
          }
        }
        var shape = new $__11.THREE.Shape(points.shift());
        for (var i = 0,
            hole = void 0; hole = points[i++]; ) {
          if (0 > polygonArea(hole)) {
            hole.reverse();
            console.log('Fixed a clockwise hole!');
          }
          hole.unshift(hole[0]);
          shape.holes.push(new $__11.THREE.Path(hole));
        }
        var geometry = new $__11.THREE.ExtrudeGeometry(shape, {
          amount: 0.02,
          steps: 1,
          material: 0,
          extrudeMaterial: 1,
          bevelEnabled: false,
          bevelThickness: 0.1,
          bevelSize: 0.2,
          bevelSegments: 1
        });
        planarProjection(geometry, {
          x: -0.5,
          y: 0
        }, {
          x: 0.5,
          y: 1
        }, $__11.THREE);
        callback(geometry);
      }, function() {
        console.log("Loading SVG...");
        callback(false);
      }, function(e) {
        console.warn("Error loading SVG!", e);
        callback(false);
      });
    }
  }, {});
  Flatland.NAME = NAME;
  Flatland.VERSION = VERSION;
  Flatland.HOMEPAGE = HOMEPAGE;
  Flatland.stubs = {
    window: {
      innerWidth: 800,
      innerHeight: 600
    },
    body: {appendChild: NOOP},
    THREE: {
      PerspectiveCamera: ($traceurRuntime.createClass)(function() {
        this.position = {set: NOOP};
      }, {}, {}),
      Scene: ($traceurRuntime.createClass)(function() {}, {add: function() {}}, {}),
      WebGLRenderer: ($traceurRuntime.createClass)(function() {}, {setSize: function() {}}, {}),
      OrbitControls: ($traceurRuntime.createClass)(function() {}, {}, {}),
      AmbientLight: ($traceurRuntime.createClass)(function() {}, {}, {}),
      TextureLoader: ($traceurRuntime.createClass)(function() {}, {}, {}),
      SVGLoader: ($traceurRuntime.createClass)(function() {}, {load: function(path, callback) {
          callback({
            getAttribute: function() {
              return 1024;
            },
            childNodes: [xc]
          });
        }}, {}),
      MeshBasicMaterial: ($traceurRuntime.createClass)(function() {}, {}, {}),
      MirroredRepeatWrapping: 8,
      Vector2: ($traceurRuntime.createClass)(function() {}, {}, {}),
      Shape: ($traceurRuntime.createClass)(function() {}, {}, {}),
      Path: ($traceurRuntime.createClass)(function() {}, {}, {}),
      ExtrudeGeometry: ($traceurRuntime.createClass)(function() {}, {}, {})
    }
  };
  function NOOP() {}
  function polygonArea(vertices) {
    var area = 0;
    for (var i = 0,
        j = void 0; i < vertices.length; i++) {
      j = (i + 1) % vertices.length;
      area += vertices[i].x * vertices[j].y;
      area -= vertices[j].x * vertices[i].y;
    }
    return area / 2;
  }
  function planarProjection(geometry, min, max, THREE) {
    if (!min || !max) {
      geometry.computeBoundingBox();
      min = min || geometry.boundingBox.min;
      max = max || geometry.boundingBox.max;
    }
    var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
    var faces = geometry.faces;
    geometry.faceVertexUvs[0] = [];
    for (var i = 0; i < faces.length; i++) {
      var v1 = geometry.vertices[faces[i].a],
          v2 = geometry.vertices[faces[i].b],
          v3 = geometry.vertices[faces[i].c];
      ;
      geometry.faceVertexUvs[0].push([new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y), new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y), new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)]);
    }
    geometry.uvsNeedUpdate = true;
  }
}('object' == (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);
!function(ROOT) {
  'use strict';
  ROOT.Flatland.El = ($traceurRuntime.createClass)(function(config, app) {}, {}, {});
}('object' == (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);
!function(ROOT) {
  'use strict';
  ROOT.Flatland.El.Cutout = function($__super) {
    function $__0(config, app) {
      var $__11;
      $traceurRuntime.superConstructor($__0).call(this, config, app);
      var defaults = {
        bitmap: ROOT.Flatland.HOMEPAGE + '/support/assets/test-1024.jpg',
        svg: ROOT.Flatland.HOMEPAGE + '/support/assets/test.svg',
        x: 0,
        y: 0,
        z: 0,
        xRotate: 0,
        yRotate: 0,
        zRotate: 0,
        xyScale: null,
        xScale: 1,
        yScale: 1,
        zScale: 1,
        repeat: 1,
        shadow: true,
        visible: true,
        luminous: false
      };
      Object.assign(this, defaults, config, {app: app});
      this.material = app.getMaterial(this.bitmap, this.repeat, this.luminous);
      app.getGeometry(this.svg, ($__11 = this, function(geometry) {
        if (!geometry)
          return;
        $__11.ref = new app.THREE.Mesh(geometry, new app.THREE.MultiMaterial([$__11.material, $__11.material]));
        if (null != $__11.xyScale)
          $__11.xScale = $__11.yScale = $__11.xyScale;
        $__11.ref.position.set($__11.x, $__11.y, $__11.z);
        $__11.ref.scale.set($__11.xScale, $__11.yScale, 1);
        $__11.ref.visible = $__11.visible;
        $__11.ref.rotation.set($__11.xRotate * Math.PI / 180, $__11.yRotate * Math.PI / 180, $__11.zRotate * Math.PI / 180);
        if (!$__11.luminous) {
          $__11.ref.receiveShadow = $__11.shadow;
          $__11.ref.castShadow = $__11.shadow;
        }
        app.scene.add($__11.ref);
      }));
    }
    return ($traceurRuntime.createClass)($__0, {}, {}, $__super);
  }(ROOT.Flatland.El);
}('object' == (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);
!function(ROOT) {
  'use strict';
  ROOT.Flatland.El.Light = function($__super) {
    function $__0(config, app) {
      $traceurRuntime.superConstructor($__0).call(this, config, app);
    }
    return ($traceurRuntime.createClass)($__0, {}, {}, $__super);
  }(ROOT.Flatland.El);
}('object' == (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);
!function(ROOT) {
  'use strict';
  ROOT.Flatland.El.Light.Ambient = function($__super) {
    function $__0(config, app) {
      $traceurRuntime.superConstructor($__0).call(this, config, app);
      var defaults = {
        color: 0xFFFFFF,
        intensity: 0.5
      };
      Object.assign(this, defaults, config, {app: app});
      this.ref = new app.THREE.AmbientLight(this.color, this.intensity);
    }
    return ($traceurRuntime.createClass)($__0, {}, {}, $__super);
  }(ROOT.Flatland.El.Light);
}('object' == (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);
!function(ROOT) {
  'use strict';
  ROOT.Flatland.El.Light.Spot = function($__super) {
    function $__0(config, app) {
      $traceurRuntime.superConstructor($__0).call(this, config, app);
      var defaults = {
        x: 0,
        y: 0,
        z: 0,
        color: 0xFFFFFF,
        intensity: 0.5,
        distance: 40,
        angle: 30,
        penumbra: 0.2,
        decay: 0,
        lookAt: {
          x: 0,
          y: 0,
          z: 0
        },
        shadow: {
          enabled: true,
          near: 0.5,
          mapSize: 2048
        }
      };
      Object.assign(this, defaults, config, {app: app});
      this.ref = new app.THREE.SpotLight(this.color, this.intensity, this.distance, this.angle * Math.PI / 180, this.penumbra, this.decay);
      this.ref.position.set(this.x, this.y, this.z);
      this.ref.castShadow = this.shadow.enabled;
      this.ref.shadow.camera.near = this.shadow.near;
      this.ref.shadow.mapSize.width = this.shadow.mapSize;
      this.ref.shadow.mapSize.height = this.shadow.mapSize;
      this.ref.lookAt(new app.THREE.Vector3(this.lookAt.x, this.lookAt.y, this.lookAt.z));
      if (app.originMarkers) {
        var marker = new app.THREE.Mesh(new app.THREE.CubeGeometry(0.1, 0.1, 0.1), new app.THREE.MeshBasicMaterial({color: this.color}));
        marker.position.set(0, 0, 0);
        this.ref.add(marker);
      }
    }
    return ($traceurRuntime.createClass)($__0, {}, {}, $__super);
  }(ROOT.Flatland.El.Light);
}('object' == (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);
//# sourceURL=<compile-source>




//\\//\\ built by Oopish Make 0.0.9 //\\//\\ http://ootility.oopish.com //\\//\\
