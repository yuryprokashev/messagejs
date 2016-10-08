var mongoose = require('mongoose');

// mongoose.connect("mongodb://localhost:27017/pfin");
console.log(process.env.DB_MESSAGES);
mongoose.connect(`mongodb://pfdb.edufun.me:27107/pfin`);

var PayloadModel = mongoose.model('Payload', require('./message.schema.js'), 'messages');

module.exports = PayloadModel;