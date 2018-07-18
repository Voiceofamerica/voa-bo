console.log('Attempting Xwalk build fix')
var fs = require('fs');
var path = require('path');
var rootdir = process.env.PWD;
var platformAndroidPath = '/platforms/android/';
var srcFile = path.join(rootdir, 'build-extras.gradle');
var destFile = path.join(rootdir, platformAndroidPath, 'build-extras.gradle');
var destDir = path.dirname(destFile);
if (fs.existsSync(srcFile) && fs.existsSync(destDir)) {
  console.log('Copying Xwalk build fix')
  fs.createReadStream(srcFile).pipe(fs.createWriteStream(destFile));
} else {
  throw new Error('Unable to copy build-extras.gradle');
}