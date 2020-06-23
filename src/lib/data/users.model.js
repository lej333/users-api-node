const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  creationUserId: {
    type: String,
    default: ''
  },
  modifiedDate: {
    type: Date,
    default: null
  },
  modifiedUserId: {
    type: String,
    default: null
  }
});

schema.set('toJSON', {
  virtuals: true
});

module.exports = Mongoose.model('users', schema);