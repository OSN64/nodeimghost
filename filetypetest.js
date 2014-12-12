// var mmm = require('mmmagic'),
//       Magic = mmm.Magic;
// var magic = new Magic(mmm.MAGIC_MIME_TYPE);
//  magic.detectFile('.tmp/uploads/M7hGzPP', function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       // output on Windows with 32-bit node:
//       //    application/x-dosexec
//   });
var path = require('path');
var filePath = "/home/dave/Desktop/Projects/nodeimghost/.tmp/uploads/tmp/ob$KDhXS.jpg"
var dir = path.dirname(filePath)
console.log(dir)

// + user can supply URL to remote image to download
// + user registeration/login (so they can view/upload/delete images to their account)
// * Ensure file type (read headers?)
// tmpdir and move to acdir when validated
// move to config type system

// npm install sails-generate-auth
