module.exports = {
  imagesContainsName: function(images, name) {
    var contains = false
    if (!_.isEmpty(images))
      contains = (_.find(images, function(inImage) { // move to check owner service/ contains
        return inImage.name == name;
      }) ? true : false); // set owner to true if any images in session is an image
    return contains;
  }
}
