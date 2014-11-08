/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var sid = require('shortid');
 var fs = require('fs');
 var mkdirp = require('mkdirp');

 var UPLOAD_PATH = 'images';

// Setup id generator
sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
sid.seed(42);

function safeFilename(name) {
  name = name.replace(/ /g, '-');
  name = name.replace(/[^A-Za-z0-9-_\.]/g, '');
  name = name.replace(/\.+/g, '.');
  name = name.replace(/-+/g, '-');
  name = name.replace(/_+/g, '_');
  return name;
}

function fileMinusExt(fileName) {
  return fileName.split('.').slice(0, -1).join('.');
}

function fileExtension(fileName) {
  return fileName.split('.').slice(-1);
}

// Where you would do your processing, etc
// Stubbed out for now
function processImage(id, name, path, cb) {
  console.log('Processing image');

  cb(null, {
    'result': 'success',
    'id': id,
    'name': name,
    'path': path
  });
}
function SomeReceiver (){}
module.exports = {



  /**
   * `ImageController.upload()`
   */
   upload: function (req, res) {
   // var file = req.file('imageFile'),
   //    id = sid.generate(),
   //    fileName = id + "." + fileExtension(safeFilename(file.name)),
   //    dirPath = UPLOAD_PATH + '/' + id,
   //    filePath = dirPath + '/' + fileName;

   //  try {
   //    mkdirp.sync(dirPath, 0755);
   //  } catch (e) {
   //    console.log(e);
   //  }

   //  fs.readFile(file.path, function (err, data) {
   //    if (err) {
   //      res.json({'error': 'could not read file'});
   //    } else {
   //      fs.writeFile(filePath, data, function (err) {
   //        if (err) {
   //          res.json({'error': 'could not write file to storage'});
   //        } else {
   //          processImage(id, fileName, filePath, function (err, data) {
   //            if (err) {
   //              res.json(err);
   //            } else {
   //              res.json(data);
   //            }
   //          });
   //        }
   //      })
   //    }
   //  });

  // hash file
  req.file('imageFile').upload(function (err, files) {
    if (err) return res.serverError(err);
    console.log(files)
    return res.json({
      message: files.length + ' file(s) uploaded successfully!',
      files: files
    });
  })

},

/**
   * FileController.download()
   *
   * Download a file from the server's disk.
   */
  download: function (req, res) {
    require('fs').createReadStream(req.param('path'))
    .on('error', function (err) {
      return res.serverError(err);
    })
    .pipe(res);
  }

};

