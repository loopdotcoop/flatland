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
