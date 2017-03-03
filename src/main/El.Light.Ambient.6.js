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
