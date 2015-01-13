/**
* Image.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    extension: {
      type: 'string',
      required: true
    },
    size: {
      type: 'integer',
      required: true
    },
    path: {
      type: 'string',
      required: true
    },
    thumbpath: {
      type: 'string'
      // required: true
    },
    owner:{
      model:'user'
    },
    delAccCode: {
      type:'string',
      required: true
    }
    // should probably store dimentions
  }
};

