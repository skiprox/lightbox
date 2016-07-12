/* jshint -W097 *//*global module, window, require */
'use strict';

/**
 * ImageZoomNew constructor description
 *
 * @class ImageZoomNew
 * @classdesc ImageZoomNew class description
 *
 * @param {object} options - Instance instantiation object
 * @param {string} options.example - Example options property
 */
function ImageZoomNew (options) {


}

module.exports = ImageZoomNew;

/**
 * @function public
 * [description]
 * @param {number} tick - Description of tick parameter
 * @return {object} Description of returned value
 */
ImageZoomNew.prototype.public = function(tick) {
	return { tock: tick };
};

/**
 * @function _private
 * [description]
 * @private
 * @return {boolean} Description of return value
 */
ImageZoomNew.prototype._private = function () {
	return true;
};
