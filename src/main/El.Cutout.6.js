//// Flatland //// 0.0.* //// March 2017 //// http://flatland.loop.coop/ ///////

!function (ROOT) { 'use strict'


ROOT.Flatland.El.Cutout = class extends ROOT.Flatland.El {

    constructor (config, app) {
        super(config, app)

        //// Record configuration.
        const defaults = {
            bitmap: // eg 'assets/test-1024.jpg'
                ROOT.Flatland.HOMEPAGE
              + '/support/assets/test-1024.jpg'
          , svg:    // eg 'assets/test.svg'
                ROOT.Flatland.HOMEPAGE
              + '/support/assets/test.svg'
        }
        Object.assign(this, defaults, config, { app })

        ////
        this.material = app.getMaterial(this.bitmap)

        ////
        app.getGeometry(this.svg, geometry => {
            if (! geometry) return // signifies failure

            //// Record the newly created mesh...
            this.ref = new app.THREE.Mesh(
                geometry
              , new app.THREE.MultiMaterial([
                   this.material // face material
                 , this.material // edge material
                ])
            );

            //// ...and add it to the scene.
            app.scene.add(this.ref)

        })


    }

}


}( 'object' == typeof global ? global : this ) // `window` in a browser
