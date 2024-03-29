/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs');
var sid = require('shortid');
var path = require('path');
// var UPLOAD_PATH = 'images';

// Setup id generator
// sid.characters('0123456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ');
sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
sid.seed(42);

function chkMime(filePath, err) {
  console.log(filePath)
  var filename = path.basename(filePath);
  var ext = path.extname(filePath);
  var id = path.basename(filePath,ext);
  Image.create({
    name: id,
    fileName: filename,
    extension: ext
  }, function(err, image) {
    if (err) return console.log(err);
  })
  var dir = path.dirname(filePath)

}
module.exports = {

  index: function(req, res) {
    Image.find({}, function(err, images) {
      if (err) {
        console.log(err)
      }
      // console.log(images)
      return res.view({
        title: "Menu Items",
        images: images,
      });
    });
  },

  /**
   * `ImageController.upload()`
   */
  upload: function(req, res) {

    // hash file
    // res.setTimeout(0)
    // console.log("send")
    var uploadOptions = {
      saveAs: function(__newFileStream, cb) {
        var id = sid.generate();
        var ext = path.extname(__newFileStream.filename)
        var filename = id + ext;
        // console.log(__newFileStream)

        // set a flag in db if `extention is not image and
        // create a reaper service that deletes all the image every hour
        cb(null, filename);
      },
      maxBytes: 20 * 1000 * 1000 * 100,
      dirname: "tmp/"
    }
    req.file('imageFile').upload(uploadOptions,
      function(err, files) {
        if (err) return res.serverError(err);
        //change fd to the file name

        for (var i = 0; i < files.length; i++) {
          chkMime(files[i].fd, err);
          files[i].filename = path.basename(files[i].fd, path.extname(files[i].fd))
          delete files[i].fd;
        };
        return res.json({
          message: files.length + ' file(s) uploaded successfully!',
          files: files
        });
      }).on('progress', function(event) {
      // console.log(event)
    });

  },

  /**
   * FileController.download()
   *
   * Download a file from the server's disk.
   */

  download: function(req, res) {
    // check if extention exist then return error
    Image.findOne({
      name: req.param('name')
    }, function(err, image) {
      if (err) return res.serverError()
      console.log(image)

      if (!image) return res.notFound()
      if (!image.extension == "jpeg" ||
        !image.extension == "jpg" ||
        !image.extension == "gif" ||
        !image.extension == "png")
        return res.notFound()
      fs.createReadStream("./.tmp/uploads/" + image.fileName)
        .on('error', function(err) {
          return res.serverError(err);
        })
        .pipe(res);
    });

  }

};
