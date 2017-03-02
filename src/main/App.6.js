//// Flatland //// 0.0.* //// March 2017 //// http://flatland.loop.coop/ ///////

!function (ROOT) { 'use strict'

const NAME     = 'Flatland'
    , VERSION  = '0.0.1'
    , HOMEPAGE = 'http://flatland.loop.coop/'


//// `Flatland`
const Flatland = ROOT.Flatland = class {

    constructor (config={}) {

        //// Record configuration.
        const defaults = {
        }
        Object.assign(this, defaults, config)

        //// Prepare to record new Elements.
        this.id    = 0  // the first Element’s id will be `0`
        this.els   = [] // iterate through Elements by z-index
        this.ids   = {} // lookup Elements by id
        this.focus = 0  // id of the Element which currently has focus

    }


    //// Renders each element.
    dump (config={}) {
    }


    //// Creates a new element.
    add (config={}) {
        const id = config.id = this.id++ // record the new ID in `config`
        const z  = config.z  = this.els.length // record the z-index in `config`
        this.ids[id] = this.els[z] = new config.class(config, this)
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

}




//// Properties on the `Flatland` class.
Flatland.NAME     = NAME
Flatland.VERSION  = VERSION
Flatland.HOMEPAGE = HOMEPAGE




//// PRIVATE FUNCTIONS

////
// function NOOP () {}


}( 'object' == typeof global ? global : this ) // `window` in a browser
