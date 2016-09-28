var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/pfin");

var PayloadModel = mongoose.model('Payload', require('./message.schema.js'), 'messages');

module.exports = PayloadModel;