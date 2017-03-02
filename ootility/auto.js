!function () { 'use strict'

const NAME     = 'Oopish Auto'
    , VERSION  = '0.0.8'
    , HOMEPAGE = 'http://ootility.oopish.com'

    , BYLINE   = `\n\n\n\n//\\\\ generated by ${NAME} ${VERSION}\n`
    , HELP =
`
${NAME} ${VERSION}
${'='.repeat( (NAME+VERSION).length+1 )}

This Node.js script generates and edits the class, demo, docs and test files
associated with one or more new class.

Installation
------------
If you haven’t done it already, you should set up the \`ooauto\` alias:
$ node ootility/alias.js

Basic Usage
-----------
$ cd /path/to/your/project/     # A project directory in standard Oopish format
$ ooauto --version              # Show the current ${NAME} version
$ ooauto Base Another Base.Sub  # Generate and edit files for three new classes
$ ooauto --remove Another       # Delete and edit files for the ‘Another’ class

Create Or Remove Files
----------------------
1. src/main/Base.Sub.6.js                  Source file for the new class
2. src/test/Base.Sub-universal-test.6.js   Basic unit tests you’ll add to
3. src/test/Base.Sub-browser-test.6.js     As above, for browsers only
4. src/test/Base.Sub-nonbrowser-test.6.js  As above, for Node.js only
5. src/demo/Base.Sub-demo.6.js             Usage example script
6. support/demo-base.sub.html              Usage example page (lowercase)

Options
-------
-d  --demo      Just create a demo script and page - no class, test or docs
-h  --help      Show this help message
-r  --remove    Remove existing class or classes from the project
-v  --version   Show the current ${NAME} version

This script belongs to ${HOMEPAGE}`


//// Validate the environment.
const nodePath   = process.argv.shift()
const scriptPath = process.argv.shift()
if ( '/ootility/auto.js' !== scriptPath.slice(-17) )
    return console.warn('Unexpected environment!')
if ( ( process.cwd() !== scriptPath.slice(0,-17) ) )
    return console.warn('Unexpected CWD, try:\n  $ cd /path/to/your/project/')
if ('function' !== typeof require)
    return console.warn('Use Node.js instead:\n  $ node ootility/auto.js')




//// SETUP


//// Load library functionality.
const fs = require('fs')

//// Set constants.
const topline = (fs.readFileSync(`src/main/App.6.js`)+'').split('\n')[0]
const projectTC = topline.split(' ')[1]          // titlecase, eg 'FooBar'
const projectLC = process.cwd().split('/').pop() // lowercase, eg 'foobar'
if ( projectLC.toLowerCase() != projectLC) return console.warn(
    `Project '${projectLC}' contains uppercase letters`)
if ( projectTC.toLowerCase() != projectLC) return console.warn(
    `Project '${projectLC}' is called '${projectTC}' in src/main/App.6.js`)

//// Declare variables.
let opt, demo = false, remove = false, classes = []

//// Deal with command-line options.
while ( opt = process.argv.shift() ) {
    if ('-d' === opt || '--demo'    === opt) { demo = true; continue }
    if ('-h' === opt || '--help'    === opt) return console.log(HELP)
    if ('-r' === opt || '--remove'  === opt) { remove = true; continue }
    if ('-v' === opt || '--version' === opt) return console.log(VERSION)
    if ( /^[A-Z][A-Za-z0-9]+(\.[A-Z][A-Za-z0-9]+)*$/.test(opt) )
        classes.push(opt)
    else
        console.warn(`Ignoring '${opt}' - not a valid option or class-name`)
}

//// Ignore duplicate class-names.
classes = new Set(classes)




//// CREATE OR REMOVE FILES


//// 1. src/main/Base.Sub.6.js                  Source file for the new class

classes.forEach( name => { createOrRemove(
    `src/main/${name}.6.js`
  , generateClass(name)
) })


//// 2. src/test/Base.Sub-universal-test.6.js   Basic unit tests you’ll add to
classes.forEach( name => { createOrRemove(
    `src/test/${name}-universal-test.6.js`
  , generateUniversalTest(name)
) })


//// 3. src/test/Base.Sub-browser-test.6.js     As above, for browsers only
classes.forEach( name => { createOrRemove(
    `src/test/${name}-browser-test.6.js`
  , generateBrowserTest(name)
) })


//// 4. src/test/Base.Sub-nonbrowser-test.6.js  As above, for Node.js only
classes.forEach( name => { createOrRemove(
    `src/test/${name}-nonbrowser-test.6.js`
  , generateNonbrowserTest(name)
) })


//// 5. src/demo/Base.Sub-demo.6.js             Usage example script
classes.forEach( name => { createOrRemove(
    `src/demo/${name}-demo.6.js`
  , generateDemoScript(name)
) })


//// 6. support/demo-base.sub.html              Usage example page (lowercase)
classes.forEach( name => { createOrRemove(
    `support/demo-${name.toLowerCase().replace(/\./g,'-')}.html`
  , generateDemoPage(name)
) })




//// EDIT @TODO MOVE TO `docs.js`


//// 1. src/main/README.md                      Documentation for each class
// @todo


//// 3. support/docs.html                       Documentation for each class
// @todo




//// UTILITY


////
function createOrRemove (path, content) {
    const exists = fs.existsSync(path)
    if (remove && ! exists)
        return console.warn(`Doesn’t exist: ${path}`)
    if (! remove && exists)
        return console.warn(`Already exists: ${path}`)
    if (remove)
        fs.unlinkSync(path)
    else
        fs.writeFileSync(path, content)
}


////
function generateClass (name) {
    let out = `${topline}

!function (ROOT) { 'use strict'

`

    if ( -1 == name.indexOf('.') ) {
        out += `
ROOT.${projectTC}.${name} = class {

    constructor (config, app) {
`
    } else {
        const baseName = name.split('.').slice(0, -1).join('.')
        out += `
ROOT.${projectTC}.${name} = class extends ROOT.${projectTC}.${baseName} {

    constructor (config, app) {
        super(config, app)
`
    }
    out += `
        //// Record configuration.
        const defaults = {
            aa:     10
          , bb:     null
          , cc:     app.cc
        }
        Object.assign(this, defaults, config, { app })
    }

    xxx (config) {
        const { app, aa, bb, cc } = this
        const { xx, yy, zz } = config

        ////

    }

}


}( 'object' == typeof global ? global : this ) // \`window\` in a browser
`

    return out
}


////
function generateUniversalTest (name) {
    const fullName = `${projectTC}.${name}`
    return `${topline}


//// Node.js: 7.2.0
//// Rhino:   [not tested yet]

//// Windows XP: Firefox 6, Chrome 15 (and probably lower), Opera 12.10
//// Windows 7:  IE 9, Safari 5.1
//// OS X 10.6:  Firefox 6, Chrome 16 (and probably lower), Opera 12, Safari 5.1
//// iOS:        iPad 3rd (iOS 6) Safari, iPad Air (iOS 7) Chrome
//// Android:    Xperia Tipo (Android 4), Pixel XL (Android 7.1)




if ('function' != typeof jQuery) throw Error('jQuery not found')
jQuery( function($) { 'use strict'




test('The ${name} class (universal)', () => {
    is('function' == typeof ${fullName}   , '\`${fullName}\` is a function')
})




})
`}


////
function generateBrowserTest (name) {
    const fullName = `${projectTC}.${name}`
    return `${topline}


//// Windows XP: Firefox 6, Chrome 15 (and probably lower), Opera 12.10
//// Windows 7:  IE 9, Safari 5.1
//// OS X 10.6:  Firefox 6, Chrome 16 (and probably lower), Opera 12, Safari 5.1
//// iOS:        iPad 3rd (iOS 6) Safari, iPad Air (iOS 7) Chrome
//// Android:    Xperia Tipo (Android 4), Pixel XL (Android 7.1)




if ('function' != typeof jQuery) throw Error('jQuery not found')
jQuery( function($) { 'use strict'




test('The ${name} class (browser)', () => {
    is('function' == typeof ${fullName}   , '\`${fullName}\` is a function')
})




})
`}


////
function generateNonbrowserTest (name) {
    const fullName = `${projectTC}.${name}`
    return `${topline}


//// Node.js: 7.2.0
//// Rhino:   [not tested yet]




if ('function' != typeof jQuery) throw Error('jQuery not found')
jQuery( function($) { 'use strict'




test('The ${name} class (nonbrowser)', () => {
    is('function' == typeof ${fullName}   , '\`${fullName}\` is a function')
})




})
`}


////
function generateDemoScript (name) {
    const nameLC_ = name.toLowerCase().replace(/\./g,'_')
    return `${topline}


if ('function' != typeof jQuery) throw Error('jQuery not found')
jQuery( function($) { 'use strict'


//// Create an instance of ${projectTC} with default configuration.
const ${projectLC} = new ${projectTC}({ // config
})


//// Create an instance of ${name} with default configuration.
const ${nameLC_} = new ${projectTC}.${name}({ // config
}, {}) // app


})
`}


////
function generateDemoPage (name) {
    const nameLC = name.toLowerCase()
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${name} Demo</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="How to use the ${projectTC}.${name} class">

  <!-- Usage: \`LERT("Some alert message here!")\` -->
  <script>!function(s){var A='addEventListener',L='LERT',S='setAttribute',t=top,
  w=this,d=document,u=navigator.userAgent,n=0,p,i,c,e=function(m,f,l){if(l!=+l)l
  =m.lineno,f=m.filename,m=m.message;for(i=0,c=w;c=c[['LIFE','pop','is','ready']
  [i++]];);(4<i&&w.LIFE.pop.warn||t[L])((f+':'+l).match(/[^\\/]+?\\/?[^\\/]+$/)[0]+
  '\\n'+m)};/efox\\/(\\d|[1-2]\\d)\\.|Prest/.test(u)?w.onerror=e:!/SIE 9/.test(u)&&w[
  A]?w[A]('error',e,0):w.attachEvent('onerror',e);w[L]=t[L]=t[L]||function(h){h=
  98<++n?'99!':n+' '+h;99<n?0:d.body?(p=d.createElement('TT'),p.innerHTML=h,(p.
  style[S]?p.style[S]('cssText',s):p[S]('style',s)),p.onclick=function(){d.body.
  removeChild(this)},d.body.appendChild(p)):alert(h)}}('position:fixed!importa'+
  'nt;position:absolute;display:block;top:40%;left:5%;width:90%;font-size:14px'+
  ';padding:9px;margin-left:-9px;background:tan;color:#603;z-index:99')</script>

</head>
<body style="font-family:Arial, sans-serif; background:#ccc; color:#333">

  <!-- Dropdown menu to select JavaScript format -->
  <select id="ecmaswitch" style="float:right" onchange="document.cookie=
    'ecmaswitch='+this.options[this.selectedIndex].value;location.reload()">
    <option value="~0~">ES5 Production</option><!-- default -->
    <option value="~1~">ES5 Minified</option>
    <option value="~2~">ES6 Production</option>
    <option value="~3~">ES6 Development</option>
  </select><script>!function(d,f,e){if(e=d.getElementById('ecmaswitch'))f=~~
    d.cookie.split('~')[1],e.options[f].selected=!0}(document)</script>

  <!-- Header and Navigation menu -->
  <h1 style="display:inline">${projectTC}
    <span id="version">0.0.*</span> <span id="format"></span>&nbsp;</h1>
  <div style="float:right">
    <a href="../index.html">Home</a> &nbsp;
    <a href="test.html">Test</a> &nbsp;
    <a href="index.html">Support</a> &nbsp;
    <a href="https://github.com/oopish/${projectLC}">GitHub</a> &nbsp;&nbsp;
  </div>

  <h2 style="margin-top:0.2em">${name} Demo</h2>

  <!-- Upgrade message for Internet Explorer 8 and below --><!--[if lte IE 8]>
  <script>document.getElementById('version').innerHTML='Not Supported'</script>
  <h2>Please upgrade to Internet Explorer 9 or higher</h2><![endif]-->
  <!-- Begin hiding from IE 8 and below --><!--[if gte IE 9 | !IE ]><!-->

  <!-- Displays the demo -->
  <pre id="dump" style="font: 18px Monaco,'Lucida Console',monospace;
    background:#cde; width:48em; line-height:1.15"></pre>

  <!-- Load the proper format scripts, according to the '#ecmaswitch' menu -->
  <script src="../support/ecmaswitch.js"></script>
  <script>ECMASwitch.load('../', [
      [
          '../dist/demo/${nameLC}-demo.5.js'
        , '../dist/demo/${nameLC}-demo.5.js' // no need to minify a demo script
        , '../dist/demo/${nameLC}-demo.6.js'
        ,  '../src/demo/${name}-demo.6.js'
      ]
  ])</script>

  <!-- Display the version and format -->
  <script>$('#version').html(${projectTC}.VERSION||'(no VERSION)');$('#format').html(
  'es'+'5|5 min|6|6 dev'.split('|')[~~document.cookie.split('~')[1]])</script>

  <!-- End hiding from Internet Explorer 8 and below --><!--<![endif]-->
</body>
</html>
    `}



}()
