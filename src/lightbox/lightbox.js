/* jshint -W121, -W018*/
'use strict';

/**
 * All requires
 */
var defaults = require('defaults');

/**
 * Store the default values, can be overwritten by opts
 */
var defaultValues = {
	duration: 600,
	ease: 'ease',
	elemPosition: 'relative',
	scrollGive: 100
};

/**
 * Zoom in images and have them fill the screen
 * @param {String} imageEl [The string of the containing element on the image]
 * @param {Object} opts    [The options]
 ** @param {Float} duration [The duration of the animation]
 ** @param {String} ease    [The easing to apply to the animation]
 */
function ImageZoom(imageEl, opts) {
	// Store the options
	opts = opts || {};
	this.setting = {};
	this.elem = {};
	this.prop = {};
	this._establishObjectProperties(imageEl, opts);
	// Create the overlay if it doesn't exist already
	if (this.elem.overlay === null) {
		this._createOverlay();
	}
	// Add the transitions
	this._addTransitionsAndStyles();
	// Reference the bound listeners
	this._imageClicked = this._imageClicked.bind(this);
	this._imageScrolled = this._imageScrolled.bind(this);
	this._zoomImageComplete = this._zoomImageComplete.bind(this);
	this._unZoomImageComplete = this._unZoomImageComplete.bind(this);
	this._onWindowResize = this._onWindowResize.bind(this);
	// Add the listeners
	this._addListeners();
}

// Store the prototype in a variable for ease and fun!
var proto = ImageZoom.prototype;

proto._establishObjectProperties = function (imageEl, opts) {
	// Store the settings
	this.setting = defaults(opts, defaultValues);
	// Store the elements
	this.elem.imageContainer = typeof (imageEl) === 'string' ? document.querySelector(imageEl) : imageEl;
	this.elem.image = this.elem.imageContainer.querySelector('img');
	this.elem.overlay = document.getElementById('image-zoom-overlay') || null;
	this.elem.window = window;
	this.elem.documentBody = document.body;
	// Store the properties
	this.prop.isZoomed = false;
	this.prop.storedScrollTop = null;
};

proto._addListeners = function () {
	this.elem.image.addEventListener('click', this._imageClicked);
};

proto._removeListeners = function () {
	this.elem.image.removeEventListener('click', this._imageClicked);
};

proto._imageClicked = function () {
	if (this.prop.isZoomed) {
		this.unZoomImage();
	} else {
		this.zoomImage();
	}
};

proto._imageScrolled = function () {
	if (document.body.scrollTop + this.setting.scrollGive < this.prop.storedScrollTop ||
		document.body.scrollTop - this.setting.scrollGive > this.prop.storedScrollTop) {
		this.unZoomImage();
		this.prop.storedScrollTop = null;
	}
};

proto._onWindowResize = function () {
	if (this.prop.isZoomed) {
		this.unZoomImage();
	}
};

proto._addTransitionsAndStyles = function () {
	this.elem.image.style.position = this.setting.elemPosition;
	this.elem.image.style.transition = 'transform ' + this.setting.duration + 'ms ' + this.setting.ease;
	this.elem.imageContainer.style.transition = 'transform ' + this.setting.duration + 'ms ' + this.setting.ease;
};

proto._createOverlay = function () {
	this.elem.overlay = document.createElement('div');
	this.elem.overlay.setAttribute('id', 'image-zoom-overlay');
	this.elem.overlay.style.visibility = 'hidden';
	this.elem.overlay.style.opacity = '0';
	this.elem.overlay.style.transition = 'opacity ' + this.setting.duration + 'ms ' + this.setting.ease;
	this.elem.overlay.style.position = 'fixed';
	this.elem.overlay.style.top = '0';
	this.elem.overlay.style.left = '0';
	this.elem.overlay.style.width = '100%';
	this.elem.overlay.style.height = '100%';
	this.elem.overlay.style.backgroundColor = '#ffffff';
	this.elem.documentBody.appendChild(this.elem.overlay);
};

proto._destroyOverlay = function () {
	this.elem.documentBody.removeChild(this.elem.overlay);
	this.elem.overlay = null;
};

/**
 * Public method to zoom an image
 */
proto.zoomImage = function () {
	// Set the property isZoomed to true
	this.prop.isZoomed = true;
	// Scale the image to the appropriate leve
	this._scaleImage();
	// Transform the image container to the center of the frame
	this.elem.imageContainer.style.zIndex = '100';
	this._translateImageContainer();
	// Make the opacity of the overlay set to 1
	this.elem.overlay.style.zIndex = '99';
	this.elem.overlay.style.visibility = 'visible';
	this.elem.overlay.style.opacity = '1';
	setTimeout(this._zoomImageComplete, this.setting.duration);
};

/**
 * Public method to un-zoom an image
 */
proto.unZoomImage = function () {
	// Set the property isZoomed to false
	this.prop.isZoomed = false;
	// Remove the transform on the image
	this.elem.image.style.transform = 'none';
	// Remove the transform on the image container
	this.elem.imageContainer.style.transform = 'none';
	// Make the opacity of the overlay set to 0
	this.elem.overlay.style.opacity = '0';
	setTimeout(this._unZoomImageComplete, this.setting.duration);
};

/**
 * Any cleanup we have to do after the animation completes
 */
proto._zoomImageComplete = function () {
	// Store the scrollTop value
	this.prop.storedScrollTop = document.body.scrollTop;
	// Switch the event listeners from the image to the body
	document.body.addEventListener('click', this._imageClicked);
	this.elem.image.removeEventListener('click', this._imageClicked);
	this.elem.window.addEventListener('scroll', this._imageScrolled);
	this.elem.window.addEventListener('resize', this._onWindowResize);
};

/**
 * Any cleanup we have to do after the animation completes
 */
proto._unZoomImageComplete = function () {
	this.elem.imageContainer.style.zIndex = '1';
	this.elem.overlay.style.zIndex = '1';
	this.elem.overlay.style.visibility = 'hidden';
	// Switch the event listeners from teh body to the image
	document.body.removeEventListener('click', this._imageClicked);
	this.elem.image.addEventListener('click', this._imageClicked);
	this.elem.window.removeEventListener('scroll', this._imageScrolled);
	this.elem.window.removeEventListener('resize', this._onWindowResize);
};

/**
 * Helper function to appropriately scale the image
 */
proto._scaleImage = function () {
	var scale = Math.min(this.elem.window.innerWidth / this.elem.image.offsetWidth, this.elem.window.innerHeight / this.elem.image.offsetHeight);
	this.elem.image.style.transform = 'scale(' + scale + ')';
};

/**
 * Helper function to appropriately translate the image
 */
proto._translateImageContainer = function () {
	var xDifference;
	var yDifference;
	var imageContainerCoords = {};
	// Get the center of the image
	imageContainerCoords.x = this.elem.imageContainer.getBoundingClientRect().left + this.elem.image.offsetWidth / 2;
	imageContainerCoords.y = this.elem.imageContainer.getBoundingClientRect().top + this.elem.image.offsetHeight / 2;
	// calculate the difference between the image container coords and the center of the screen
	xDifference = (this.elem.window.innerWidth / 2) - imageContainerCoords.x;
	yDifference = (this.elem.window.innerHeight / 2) - imageContainerCoords.y;
	// translate the image container by that much
	this.elem.imageContainer.style.transform = 'translate(' + xDifference + 'px, ' + yDifference + 'px)';
};

proto.destroy = function () {
	this._removeListeners();
	this.setting = null;
	this.elem = null;
	this.prop = null;
};

module.exports = ImageZoom;
