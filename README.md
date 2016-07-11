The photo server is a part of the Together app, a Fullstack Academy Capstone project by John Hill, Joel Darling and Alex Dao.  
The core is a Node Express server that accepts image files uploaded from the client app.  
- On start, the server reports the local ip address to a Heroku based mini ip address server. It also pulls down the ip address of the show runner app.
- The show runner app can initiate a 'photo event', which asks the show participants on their mobile client app if they would like to participate by taking either an event photo, or a selfie.  The name of that event is set on the photo server as well.
- Photos are automatically sent to this server.
- On receipt of the first photo, the local hard drive folder is created with the name of the photo event.
- Photos are cropped to a normalized size of 800 x 1100 pixels, and saved.
- The show runner photo counter is incremented, via a socket message.  

When the DJ is ready stop receiving photos and then process the mosaic, the show runner posts to /processPhotoShow route, which starts the processing sequence.
- The code for the sequence is located in photoProcess.js.  The function is processMosaic, which starts a chain of promisified functions.
- The individual functions that are chained together are located in utilities.js.
- dir creates an array of the file names in the event folder, then the names are randomly shuffled
- buildMosaic is called, which uses GM (node wrapper for Graphics Magick) to assemble the images into a mosaic of 23 rows and 36 columns of 800 x 1100 pixel photos. Total mosaic is 28,800 pixels wide by 25,277 tall.
- compose is called, which uses GM to compose the mosaic with a tiff file.  The resulting shape is created by the alpha channel, and the border color is set by the background color.
- deepZoomPyramid is called, which uses sharp (node wrapper for VIPS) to create a Deep Zoom image pyramid, sliced into 800 x 800 tiles.  Those image tiles are saved into the browser/images folder.
- When this entire chain of promises is fulfillled, the flow returns to the route.  A socket message is sent to the show runner, with the name of the photo event, and the url of the completed photo mosaic.
-  The DJ can then broadcast out to participants a socket event that displays the clickable url that displays the mosaic.

Mosaics are displayed via Openseadragon Deep Zoom technology, which allows for a smooth, seamless zooming into actual pixels.

This photo server can handle multiple, infinite photo events.
Code was also written to sort the images by luminance, or by warm to cool tones.  That code is currently turned off, and will be user selectable in future release.



To set up this repo, use npm install .  

Documentation for GM is here;
aheckmann.github.io/gm/
Also, install Graphics Magick via the following brew;
brew install graphicsmagick


Documentation for sharp is here;
http://sharp.dimens.io/en/stable/#contributing
Also, install VIPS via the brew below;
http://www.vips.ecs.soton.ac.uk/index.php?title=Build_on_OS_X
brew install vips --with-cfitsio --with-imagemagick --with-openexr --with-openslide --with-webp

Documentation for the Deep Zoom front end technology is here;
http://openseadragon.github.io/
http://openseadragon.github.io/examples/creating-zooming-images/


setup switch to choose dominant-color mode or shuffle mode
finish incoming switch for crowd or selfie
