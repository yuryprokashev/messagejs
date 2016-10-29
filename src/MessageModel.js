var mongoose = require('mongoose');

// const MONGO_HOST = "mongodb://localhost:27017/pfin";
const MONGO_HOST = "mongodb://54.229.108.38:27017/pfin";

mongoose.connect(MONGO_HOST);

var MessageModel = mongoose.model('Message', require('./message.schema.js'), 'messages');

module.exports = MessageModel;