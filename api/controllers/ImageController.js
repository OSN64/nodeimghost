/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var path = require('path'),
  sid = require('shortid')
uuid = require('node-uuid')
fs = require('fs');

// Setup id generator
// sid.characters('0123456789abcdefgh&jk^mn(pqrstuvwxyzABCDEFGH)JK-MN+PQRSTUVWXYZ=*');
sid.seed(42);

module.exports = {

  index: function(req, res) {
    Image.find({}).limit(10).exec(function findCB(err, images) {
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
          fileData.owner = (_.isEmpty(req.user) ? null : req.user.id); // give owner to image
          // create delete access code
          fileData.delAccCode = uuid.v4();

          Image.create(fileData).exec(function createCB(err, image) {
            if (err) {
              next(err);
            } else {
              results.push({
                id: image.id,
                name: image.name,
                path: image.path,
                thumbpath: image.thumbpath,
                delAccCode: image.delAccCode
              });
              if (_.isEmpty(req.session.images)) req.session.images = [];
              req.session.images.push({name:image.name});
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
    }).populateAll().exec(function findOneCB(err, image) {
      if (err) return res.serverError(err);
      if (_.isEmpty(image)) return res.notFound(); // no image found
      // console.log(req.user)
      // set owner to true if any images in session is an image
      var owner = Util.imagesContainsName(req.session.images,image.name);

        // console.log(image)
      return res.view({
        title: "image",
        image: image,
        owner: owner
      });
    });
  },
  /**
   * ImageController.destroy()
   *
   * Removes a file from the server's disk.
   */
  destroy: function(req, res) {
    // check if user is sure
    var delAccCode = req.param('delAccCode');
    Image.destroy({
      delAccCode: delAccCode
    }, function(err, image) {
      if (err) return res.json(err)
      if (_.isEmpty(image)) return res.serverError(); // no delete link found
      fs.unlinkSync(sails.config.appPath + "/assets/" + image[0].path); // delete the image
      fs.unlinkSync(sails.config.appPath + "/assets/" + image[0].thumbpath); // delete the thumb

      console.log(image)
      return res.redirect("/")
    });
  },
  /**
   * ImageController.update()
   *
   * update image details in the db.
   */
  update: function(req, res) {
    var owner = false;
    if (!_.isEmpty(req.session.images))
      owner = (_.find(req.session.images, function(inImage) {
        return inImage.name == req.param('image');
      }) ? true : false); // set owner to true if any images in session is an image

    if (!owner) res.notFound();
    // console.log(owner)
    Image.update({
      name: req.param('image')
    }, {
      title: req.param('title'),
      description: req.param('description')
    }, function updateCB(err, images) {
      if (err) return res.serverError(err);
      if (_.isEmpty(images)) return res.notFound(); // no image found

      return res.redirect('back')
    })
  }

};
