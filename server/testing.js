var fs = require('fs');
var ramdisk = require('node-ramdisk');

var disk = ramdisk('my_ramdisk');

var volumePoint;

// create a disk with 100MB of size
disk.create(600, function (err, mount) {
  if (err) {
    console.log(err);
  } else {
    volumePoint = mount;
    console.log(mount);
  }
});

fs.writeFile

// // when isn't needed then delete the disk 
// disk.delete(volumePoint, function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('ok');
//   }
// });
