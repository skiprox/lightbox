var Lightbox = require('./src/lightbox/lightbox');
var imageZooms = document.querySelectorAll('.lightbox');
var i = imageZooms.length;
while (i--) {
	new Lightbox(imageZooms[i], {
		ease: 'ease-in-out',
		duration: 600
	});
}
