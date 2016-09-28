/**
 * Created by py on 16/09/16.
 */

const MessageService = require('./MessageService');
const MessageModel = require('./MessageModel');

const Bus = require('./BusService');

var app = new MessageService(MessageModel, Bus);