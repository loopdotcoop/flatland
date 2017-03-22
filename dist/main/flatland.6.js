//\\//\\ src/main/App.6.js



//// Flatland //// 0.0.* //// March 2017 //// http://flatland.loop.coop/ ///////

!function (ROOT) { 'use strict'

const NAME     = 'Flatland'
    , VERSION  = '0.0.3'
    , HOMEPAGE = 'http://flatland.loop.coop/'


//// `Flatland`
const Flatland = ROOT.Flatland = class {

    constructor (config={}) {

        //// Record configuration.
        const defaults = {
            THREE:     Flatland.stubs.THREE // allows Node.js unit tests
          , originMarkers: false            // show where the scene’s (0,0,0) is
          , antialias: true                 // passed to THREE.WebGLRenderer
          , wrap:      ROOT.document ?      // HTML element to place <CANVAS> in
                           ROOT.document.body : Flatland.stubs.body
          , WINDOW:    ROOT.innerWidth ?    // get the <CANVAS> size from this
                           ROOT : Flatland.stubs.window
        }
        defaults.width  = defaults.WINDOW.innerWidth  // `window.innerWidth`
        defaults.height = defaults.WINDOW.innerHeight // `window.innerHeight`
        Object.assign(this, defaults, config)

        //// Prepare to record new Elements.
        this.id    = 0  // the first Element’s id will be `0`
        this.els   = [] // iterate through Elements by z-index
        this.ids   = {} // lookup Elements by id
        this.focus = 0  // id of the Element which currently has focus

        //// Prepare to cache materials and SVGs.
        this.materials  = {} // keys are paths, eg 'assets/test-1024.jpg'
        this.geometries = {} // keys are paths, eg 'assets/test.svg'

        //// Intantiate the loaders.
        this.textureLoader = new this.THREE.TextureLoader()
        this.svgLoader     = new this.THREE.SVGLoader()




        //// CAMERA, SCENE, RENDERER, CONTROLS, AMBIENT LIGHT

        //// Create the camera.
        this.camera = new this.THREE.PerspectiveCamera(
            25
          , this.width / this.height
          , 1
          , 1000
        );
        this.camera.position.set( 0, 2, 10 )

        //// Create the scene and the renderer.
        this.scene = new this.THREE.Scene()
        this.renderer = new this.THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.width, this.height)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.wrap.appendChild(this.renderer.domElement)

        //// Create mouse controls (rotate, pan and zoom).
        this.controls = new this.THREE.OrbitControls(this.camera, this.wrap)
        // this.controls.target = this.THREE.Vector3(0, 3, 0)

        //// Add an ambient light - this always has element id zero.
        this.add({
            class:     Flatland.El.Light.Ambient
          , color:     0xFFFFFF
          , intensity: 0.3
        })

/* @TODO remove this
        for (let i=0, cube; i<123; i++) {
        	cube = new this.THREE.Mesh(
                new this.THREE.CubeGeometry( 0.1, 0.1, 0.1 )
              , new this.THREE.MeshLambertMaterial({
                    color:     0xFF0000
                  , wireframe: false
                })
            )
        	cube.position.set(
                Math.random() * 6 - 3
              , Math.random() * 6 - 3
              , Math.random() * 6 - 3
            )
            this.scene.add(cube)
        }
*/

        //// Show the origin.
        if (this.originMarkers) {
        	const origin = new this.THREE.Mesh(
                new this.THREE.CubeGeometry( 0.1, 0.1, 0.1 )
              , new this.THREE.MeshBasicMaterial({ color: 0xFFFFFF })
            )
        	origin.position.set(0, 0, 0)
            this.scene.add(origin)
        	const x1 = new this.THREE.Mesh(
                new this.THREE.CubeGeometry( 0.1, 0.1, 0.1 )
              , new this.THREE.MeshBasicMaterial({ color: 0xFF0000 })
            )
        	x1.position.set(1, 0, 0)
            this.scene.add(x1)
        	const y1 = new this.THREE.Mesh(
                new this.THREE.CubeGeometry( 0.1, 0.1, 0.1 )
              , new this.THREE.MeshBasicMaterial({ color: 0x00FF00 })
            )
        	y1.position.set(0, 1, 0)
            this.scene.add(y1)
        	const z1 = new this.THREE.Mesh(
                new this.THREE.CubeGeometry( 0.1, 0.1, 0.1 )
              , new this.THREE.MeshBasicMaterial({ color: 0x0000FF })
            )
        	z1.position.set(0, 0, 1)
            this.scene.add(z1)
        }

    }


    //// Renders each element.
    render (config={}) {
        this.renderer.render(this.scene, this.camera)
    }


    //// Creates a new element.
    add (config={}) {
        const
            id = config.id = this.id++     // record the new ID in `config`
          , len = this.els.length          // record the z-index in `config`
          , el = this.ids[id] = this.els[len] = new config.class(config, this)
        if (el.ref) this.scene.add(el.ref) // if its THREE.Object3D is ready
        return id
    }


    //// Modifies an element.
    edit (config={}) {
        const el = this.ids[config.id]
        if (! el) return // no such element
        el.edit(config)
    }


    //// Triggers events on Elements.
    trigger (config) {
        const { ids, id } = this
    }


    //// Returns a material from the materials cache, or creates it if missing.
    getMaterial (path, repeat, luminous) {
        if (this.materials[path]) return this.materials[path]
        let texture = this.textureLoader.load(path)

        //// Apply attributes to the texture. @TODO different attribs need different caches
        texture.wrapS = texture.wrapT = this.THREE.MirroredRepeatWrapping
        texture.repeat.set(repeat, repeat)

        if (luminous)
            return this.materials[path] = new this.THREE.MeshBasicMaterial({
                color:     0xFFFFFF
              , map:       texture
              , wireframe: false
            })
        else
            return this.materials[path] = new this.THREE.MeshLambertMaterial({
                color:     0x999999
              , map:       texture
              , wireframe: false
            })
    }


    //// Returns a geometry from the geometries cache, or creates it if missing.
    //// To create it, it loads the SVG shape, extrudes it, and uv-maps it.
    getGeometry (path, callback) {
        if (this.geometries[path]) return this.geometries[path]

        this.svgLoader.load(
            path // eg 'assets/svg/tree.svg'
          , svgElement => {
                if ('parsererror' === svgElement.tagName) //@TODO test cross-browser
                    return console.warn(`Cannot parse ${path}`)

                const
                    width  = parseInt( svgElement.getAttribute('width') )
                  , height = parseInt( svgElement.getAttribute('height') )
                  , points = []
                if (width !== height)
                    return console.warn(`width ${width} !== height ${height}`)
                for (let i=0, node; node=svgElement.childNodes[i++];) {

                    if (! node.tagName) continue // probably a text-node
                    if ( 'polygon' !== node.tagName.toLowerCase() )
                        return console.warn(`${path} unexpected node.tagName`)

                    //// Polygon index 0 is the main shape. The rest are holes.
                    points.push([])

                    //// Read the path-data from the SVG, and create a shape.
                    const pairs =
                        node
                       .getAttribute('points')
                       .replace(/\s+/g, ' ') // newlines, multiple spaces
                       .replace(/\s+$/, '') // space at end
                       .split(' ')

                    //// Store each point as a two-value vector.
                    for (let j=0, pair, p; pair=pairs[j++];) {
                        p = pair.split(',')
                        points[points.length-1].push(
                            new this.THREE.Vector2(
                                  p[0] / width - 0.5
                              , - p[1] / width + 1 // reverse the Y-direction
                            )
                        )
                    }

                }

                //// Create the shape.
                const shape = new this.THREE.Shape( points.shift() )
                for (var i=0, hole; hole=points[i++];) {
                    if (0 > polygonArea(hole) ) {
                        hole.reverse()
                        console.log('Fixed a clockwise hole!')
                    }
                    hole.unshift( hole[0] ) // use first vertex as 'offset'
                    shape.holes.push( new this.THREE.Path(hole) )
                }

                //// Extrude the shape.
                var geometry = new this.THREE.ExtrudeGeometry(
                    shape
                  , {
                        amount          : 0.02
                      , steps           : 1
                      , material        : 0
                      , extrudeMaterial : 1
                      , bevelEnabled    : false
                      , bevelThickness  : 0.1
                      , bevelSize       : 0.2
                      , bevelSegments   : 1
                    }
                )

                //// Remap the UVs.
                planarProjection(
                    geometry
                  , { x:-0.5, y:0 } // move the origin...
                  , { x: 0.5, y:1 } // ...to the bottom-middle
                  , this.THREE
                )

                //// Pass the geometry back to the original caller.
                callback(geometry)
            }
          , function () { console.log("Loading SVG...")     ; callback(false) }
          , function (e) {console.warn("Error loading SVG!",e); callback(false)}
        )

    }

}




//// Properties on the `Flatland` class.
Flatland.NAME     = NAME
Flatland.VERSION  = VERSION
Flatland.HOMEPAGE = HOMEPAGE

////
Flatland.stubs = {
    window: {
        innerWidth:  800
      , innerHeight: 600
    }
  , body: {
        appendChild: NOOP
    }
  , THREE: {
        PerspectiveCamera: class {
            constructor () {
                this.position = { set: NOOP }
            }
        }
      , Scene: class {
            add () {}
        }
      , WebGLRenderer: class {
            setSize () {}
        }
      , OrbitControls: class { }
      , AmbientLight: class { }
      , TextureLoader: class { }
      , SVGLoader: class {
            load (path, callback) {
                callback({
                    getAttribute: () => 1024 // eg `getAttribute('width')`
                  , childNodes: [
                        xc
                    ]
                })
            }
        }
      , MeshBasicMaterial: class { }
      , MirroredRepeatWrapping: 8
      , Vector2: class { }
      , Shape: class { }
      , Path: class { }
      , ExtrudeGeometry: class { }
    }
}


//// PRIVATE FUNCTIONS

////
function NOOP () {}


//// stackoverflow.com/a/14506549
function polygonArea(vertices) {
    var area = 0;
    for (var i=0, j; i<vertices.length; i++) {
        j = (i + 1) % vertices.length;
        area += vertices[i].x * vertices[j].y;
        area -= vertices[j].x * vertices[i].y;
    }
    return area / 2;
}


//// stackoverflow.com/a/20774922
//// `min` & `max` are optional - leave them out to use geometry bounds.
function planarProjection (geometry, min, max, THREE) {

    if (! min || ! max) {
        geometry.computeBoundingBox();
        min = min || geometry.boundingBox.min;
        max = max || geometry.boundingBox.max;
    }
    var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range  = new THREE.Vector2(max.x - min.x, max.y - min.y);
    var faces = geometry.faces;

    geometry.faceVertexUvs[0] = [];

    for (var i = 0; i < faces.length; i++) {

        var v1 = geometry.vertices[ faces[i].a ]
          , v2 = geometry.vertices[ faces[i].b ]
          , v3 = geometry.vertices[ faces[i].c ]
        ;

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(
                (v1.x + offset.x) / range.x
              , (v1.y + offset.y) / range.y )
          , new THREE.Vector2(
                (v2.x + offset.x) / range.x
              , (v2.y + offset.y) / range.y )
          , new THREE.Vector2(
                (v3.x + offset.x) / range.x
              , (v3.y + offset.y) / range.y )
        ]);
    }

    geometry.uvsNeedUpdate = true;
}


}( 'object' == typeof global ? global : this ) // `window` in a browser




//\\//\\ src/main/El.6.js



//// Flatland //// 0.0.* //// March 2017 //// http://flatland.loop.coop/ ///////

!function (ROOT) { 'use strict'


ROOT.Flatland.El = class {

    constructor (config, app) {
    }

}


}( 'object' == typeof global ? global : this ) // `window` in a browser




//\\//\\ src/main/El.Cutout.6.js



//// Flatland //// 0.0.* //// March 2017 //// http://flatland.loop.coop/ ///////

!function (ROOT) { 'use strict'


ROOT.Flatland.El.Cutout = class extends ROOT.Flatland.El {

    constructor (config, app) {
        super(config, app)

        //// Record configuration.
        const defaults = {
            bitmap:  // eg 'assets/test-1024.jpg'
                ROOT.Flatland.HOMEPAGE
              + '/support/assets/test-1024.jpg'
          , svg:     // eg 'assets/test.svg'
                ROOT.Flatland.HOMEPAGE
              + '/support/assets/test.svg'
          , x:        0
          , y:        0
          , z:        0
          , xRotate:  0 // in degrees
          , yRotate:  0 // in degrees
          , zRotate:  0 // in degrees
          , xyScale:  null
          , xScale:   1
          , yScale:   1
          , zScale:   1
          , repeat:   1
          , shadow:   true
          , visible:  true // visible by default
          , luminous: false
        }
        Object.assign(this, defaults, config, { app })

        ////
        this.material = app.getMaterial(this.bitmap, this.repeat, this.luminous)

        ////
        app.getGeometry(this.svg, geometry => {
            if (! geometry) return // signifies failure

            //// Record the newly created mesh.
            this.ref = new app.THREE.Mesh(
                geometry
              , new app.THREE.MultiMaterial([
                   this.material // face material
                 , this.material // edge material
                ])
            );

            //// Convert multi-attributes to singles.
            if (null != this.xyScale) this.xScale = this.yScale = this.xyScale

            //// Apply attributes to the mesh.
            this.ref.position.set(this.x, this.y, this.z)
            this.ref.scale.set(this.xScale, this.yScale, 1)
            this.ref.visible = this.visible
            this.ref.rotation.set(
                this.xRotate * Math.PI / 180
              , this.yRotate * Math.PI / 180
              , this.zRotate * Math.PI / 180
            )

            //// Luminous Cutouts do not recieve or cast shadows.
            if (! this.luminous) {
                this.ref.receiveShadow = this.shadow
                this.ref.castShadow = this.shadow
            }

            //// Add the mesh to the scene.
            app.scene.add(this.ref)

        })


    }

}


}( 'object' == typeof global ? global : this ) // `window` in a browser




//\\//\\ src/main/El.Light.6.js



//// Flatland //// 0.0.* //// March 2017 //// http://flatland.loop.coop/ ///////

!function (ROOT) { 'use strict'


ROOT.Flatland.El.Light = class extends ROOT.Flatland.El {

    constructor (config, app) {
        super(config, app)
    }

}


}( 'object' == typeof global ? global : this ) // `window` in a browser




//\\//\\ src/main/El.Light.Ambient.6.js



//// Flatland //// 0.0.* //// March 2017 //// http://flatland.loop.coop/ ///////

!function (ROOT) { 'use strict'


ROOT.Flatland.El.Light.Ambient = class extends ROOT.Flatland.El.Light {

    constructor (config, app) {
        super(config, app)

        //// Record configuration.
        const defaults = {
            color:     0xFFFFFF
          , intensity: 0.5
        }
        Object.assign(this, defaults, config, { app })

        //// Instantiate the THREE object.
        this.ref = new app.THREE.AmbientLight(
            this.color
          , this.intensity
        )
    }

}


}( 'object' == typeof global ? global : this ) // `window` in a browser




//\\//\\ src/main/El.Light.Spot.6.js



//// Flatland //// 0.0.* //// March 2017 //// http://flatland.loop.coop/ ///////

!function (ROOT) { 'use strict'


ROOT.Flatland.El.Light.Spot = class extends ROOT.Flatland.El.Light {

    constructor (config, app) {
        super(config, app)

        //// Record configuration.
        const defaults = {
            x:          0 //@TODO inherit from El
          , y:          0
          , z:          0
          , color:      0xFFFFFF
          , intensity:  0.5
          , distance:   40
          , angle:      30
          , penumbra:   0.2
          , decay:      0
          , lookAt:     { x:0, y:0, z:0 }
          , shadow: {
                enabled: true
              , near:    0.5
              , mapSize: 2048
            }
        }
        Object.assign(this, defaults, config, { app })

        //// Instantiate the THREE object.
        this.ref = new app.THREE.SpotLight(
            this.color
          , this.intensity
          , this.distance
          , this.angle * Math.PI / 180
          , this.penumbra
          , this.decay
        )

        //// Apply attributes to the mesh.
        this.ref.position.set(this.x, this.y, this.z)
        this.ref.castShadow = this.shadow.enabled
        this.ref.shadow.camera.near    = this.shadow.near
        this.ref.shadow.mapSize.width  = this.shadow.mapSize
        this.ref.shadow.mapSize.height = this.shadow.mapSize
        this.ref.lookAt( new app.THREE.Vector3(
            this.lookAt.x
          , this.lookAt.y
          , this.lookAt.z
        ) )

        if (app.originMarkers) {
        	const marker = new app.THREE.Mesh(
                new app.THREE.CubeGeometry( 0.1, 0.1, 0.1 )
              , new app.THREE.MeshBasicMaterial({ color: this.color })
            )
        	marker.position.set(0, 0, 0)
            this.ref.add(marker)
        }

    }
}


}( 'object' == typeof global ? global : this ) // `window` in a browser




//\\//\\ built by Oopish Make 0.0.9 //\\//\\ http://ootility.oopish.com //\\//\\
