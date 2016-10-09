var mongoose = require('mongoose');

// mongoose.connect("mongodb://localhost:27017/pfin");
// console.log(process.env.DB_MESSAGES);
mongoose.connect("mongodb://54.229.108.38:27017/pfin");

var MessageModel = mongoose.model('Message', require('./message.schema.js'), 'messages');

module.exports = MessageModel;