module.exports = {

  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    username: {
      type: 'string',
      unique: true
    },
    email: {
      type: 'email',
      unique: true
    },
    passports: {
      collection: 'Passport',
      via: 'user'
    },
    images: {
      collection: 'image',
      via: 'owner'
    }
  }
};

