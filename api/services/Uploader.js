// Uploader utilities and helper methods
// designed to be relatively generic.

var fs = require('fs'),
  Writable = require('stream').Writable,
  im = require('imagemagick-stream'),
  path = require('path');

exports.documentReceiverStream = function(options) {
  var defaults = {
    dirname: '/dev/null/',
    thumb: {
      size: '200x200',
      quality: 90
    },
    saveAs: function(file) {
      return file.filename;
    },
    completed: function(file, done) {
      done();
    }
  };
  var dir;
  // I don't have access to jQuery here so this is the simplest way I
  // could think of to merge the options.
  opts = defaults;
  if (options.dirname) {
    opts.dirname = sails.config.appPath + "/assets/" + options.dirname;
    dir = options.dirname;
  }
  if (options.saveAs) opts.saveAs = options.saveAs;
  if (options.completed) opts.completed = options.completed;
  if (options.thumb) opts.thumb = options.thumb;

  var documentReceiver = Writable({
    objectMode: true
  });

  // the resize function
  var resize = im().resize(opts.thumb.size).quality(opts.thumb.quality);

  // This `_write` method is invoked each time a new file is received
  // from the Readable stream (Upstream) which is pumping filestreams
  // into this receiver.  (filename === `file.filename`).
  documentReceiver._write = function onFile(file, encoding, done) {
    var newFilename = opts.saveAs(file),
      fileSavePath = opts.dirname + newFilename,
      thumbSavePath = opts.dirname + 'thumbs/' + "thumb-" + newFilename,
      outputs = fs.createWriteStream(fileSavePath, encoding)
    thumbOut = fs.createWriteStream(thumbSavePath, encoding);
    // sails.log.debug(newFilename)
    // sails.log.debug(thumbFilename)
    // sails.log.debug(fileSavePath)
    // sails.log.debug(thumbSavePath)
    file.pipe(outputs)
    file.pipe(resize).pipe(thumbOut);

    // Garbage-collect the bytes that were already written for this file.
    // (called when a read or write error occurs)
    function gc(err) {
      sails.log.debug("Garbage collecting file '" + file.filename + "' located at '" + fileSavePath + "'");

      fs.unlink(fileSavePath, function(gcErr) {
        if (gcErr) {
          return done([err].concat([gcErr]));
        } else {
          fs.unlink(thumbSavePath, function(gcErr) {
            if (gcErr) {
              return done([err].concat([gcErr]));
            } else {
              return done(err);
            }
          });
        }
      });
    };

    file.on('error', function(err) {
      sails.log.error('READ error on file ' + file.filename, '::', err);
    });

    outputs.on('error', function failedToWriteFile(err) {
      sails.log.error('failed to write file', file.filename, 'with encoding', encoding, ': done =', done);
      gc(err);
    });
    // only alllow certain extentions
    outputs.on('finish', function successfullyWroteFile() {
      // console.log(file)
      sails.log.debug("file uploaded")
      opts.completed({
        name: path.basename(newFilename,path.extname(newFilename)),
        size: file.byteCount,
        extension: path.extname(newFilename),
        path: (dir || opts.dirname) + newFilename,
        thumbpath: (dir || opts.dirname) + 'thumbs/' + "thumb-" + newFilename
      }, done);
    });
  };

  return documentReceiver;
}
