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
          , shadow:   false//true
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
