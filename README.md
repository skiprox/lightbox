# lightbox
Zoom in on images like blam. See [the github.io page](http://skiprox.github.io/lightbox/).

## Getting Started
You can require this as a dependency via `npm install git+ssh://git@github.com:skiprox/lightbox.git --save` or just copy/paste `lightbox.js` into your project, and then require it via browserify, like so:

```
// via npm install...
var Lightbox = require( 'lightbox' );
// Or downloaded locally...
var Lightbox = require('./modules/lightbox');
// And call it (more on this below)
var Lightboxer = new Lightbox('.lightboxer', {ease: 'ease-in-out', duration: 400});
```

## Documentation

### Lightbox Options
List module options here.

* `@param {String OR Element} imageEl` - The string to query the dom for to find the element, or the actual element.
* `@param {Object} opts` - The options (see below)
	* `@param {Float} duration` - The duration of the zoom
	* `@param {String} ease` - The easing to apply to the zoom
	* `@param {String} elemPosition` - The position of the image element (e.g. `relative` or `absolute`), because we need to give the element a position that can take `z-index` before we animate it.
	* `@param {Float} scrollGive` - The amount you can scroll (in pixels) before the image un-zooms itself.


### Lightbox Public Methods
List all public methods here.  CamelCase method names.  Do not include private methods.

* `Lightbox.zoomImage` - Manually call zoom on the image.
* `Lightbox.unZoomImage` - Manually call unzoom on the image.
* `Lightbox.destroy` - Get rid of the listeners and stored elements attached to `this`.


## Usage
This should be used to create nice image overlays on a blog type page or a case-studies page or whatever you want. Anywhere you would use a lightbox, you can use this instead.


### Examples
Here is something similar to how yours could look :)

```
var Lightbox = require( 'lightbox' );
var Lightboxer = new Lightbox('#lightbox', {
	ease: 'ease-in-out',
	duration: 400,
	elemPosition: 'relative',
	scrollGive: 200
});
```
