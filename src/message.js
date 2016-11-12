/**
 * Created by py on 16/09/16.
 */

const MessageService = require('./MessageService2');
const parseProcessArgs = require('./parseProcessArgs');
var args = parseProcessArgs();

var app = new MessageService(args[0].isProd);
// app.listen();