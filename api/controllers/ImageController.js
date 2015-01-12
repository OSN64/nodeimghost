/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var path = require('path'),
  sid = require('shortid');

// Setup id generator
// sid.characters('0123456789abcdefgh&jk^mn(pqrstuvwxyzABCDEFGH)JK-MN+PQRSTUVWXYZ=*');
sid.seed(42);

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
    // console.log(req.params.all())
    // console.log(req)
    var results = [],
      streamOptions = {
        dirname: "uploads/", // add a configurable path
        thumb: {
          size: '400X400',
          quality: 90
        },
        saveAs: function(file) {
          var filename = file.filename,
            newName = sid.generate() + path.extname(filename);
          return newName;
        },
        completed: function(fileData, next) {
          Image.create(fileData).exec(function(err, savedFile) {
            if (err) {
              next(err);
            } else {
              results.push({
                id: savedFile.id,
                name: savedFile.name,
                path: savedFile.path,
                thumbpath: savedFile.thumbpath,
              });
              next();
            }
          });
        }
      };

    req.file('imageFile').upload(Uploader.documentReceiverStream(streamOptions),
      function(err, files) {
        if (err) return res.serverError(err);
        // console.log(files)
        res.json({
          message: files.length + ' file(s) uploaded successfully!',
          files: results
        });
      }
    );
  },
  /**
   * ImageController.show()
   *
   * Display a file from the server's disk.
   */

  show: function(req, res) {
    var name = req.param('name');
    Image.findOne({
      name: name
    }, function(err, image) {
      if (err) return res.serverError(err);
      if (_.isEmpty(image)) return res.notFound(); // no image found

      // console.log(image)
      return res.view({
        title: "image",
        image: image,
      });
    });
  },
  /**
   * ImageController.destroy()
   *
   * Removes a file from the server's disk.
   */
  destroy: function(req, res) {
    console.log("destroy")
    // if (req.isSocket) {
    //   var params = req.params.all();
    //   Image.destroy({
    //     id: params.id
    //   }, function(err, image) {
    //     if (err) return res.json(err)
    //     if (_.isEmpty(image)) return res.serverError();
    //     // fs.unlinkSync('./.tmp/uploads/' + image[0].fileName); // delete the image
    //     return res.json(image);
    //   });
    // }
  }

};
