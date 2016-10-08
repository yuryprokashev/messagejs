var mongoose = require('mongoose');

// mongoose.connect("mongodb://localhost:27017/pfin");
mongoose.connect(`${process.env.DB_MESSAGES}`);

var PayloadModel = mongoose.model('Payload', require('./message.schema.js'), 'messages');

module.exports = PayloadModel;