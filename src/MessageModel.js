var mongoose = require('mongoose');

// mongoose.connect("mongodb://localhost:27017/pfin");
console.log(process.env.DB_MESSAGES);
mongoose.connect(`${process.env.DB_MESSAGES}:27107/pfin`);

var PayloadModel = mongoose.model('Payload', require('./message.schema.js'), 'messages');

module.exports = PayloadModel;