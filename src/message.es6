/**
 *Created by py on 24/01/2017
 */

"use strict";
const SERVICE_NAME = 'messagejs';

const KAFKA_TEST = "54.154.211.165";
const KAFKA_PROD = "54.154.226.55";
const parseProcessArgs = require('./parseProcessArgs.es6');
let args = parseProcessArgs();
let kafkaHost = (function(bool){
    let result = bool ? KAFKA_PROD : KAFKA_TEST;
    console.log(result);
    return result;
})(args[0].isProd);

const EventEmitter = require('events').EventEmitter;

const dbFactory = require('./dbFactory.es6');
const loggerAgentFactory = require('my-logger').loggerAgentFactory;

const kafkaBusFactory = require('my-kafka').kafkaBusFactory;
const kafkaServiceFactory = require('my-kafka').kafkaServiceFactory;

const configObjectFactory = require('my-config').configObjectFactory;
const configServiceFactory = require('my-config').configServiceFactory;
const configCtrlFactory = require('my-config').configCtrlFactory;

const messageCtrlFactory = require('./messageCtrlFactory.es6');
const messageServiceFactory = require('./messageServiceFactory.es6');
const buildMongoConStr = require('./helpers/buildConnString.es6');

let kafkaBus,
    db,
    configObject;

let kafkaService,
    configService,
    messageService;

let messageCtrl,
    configCtrl,
    loggerAgent;

let dbConfig,
    dbConnectStr;

let startKafka,
    startConfig,
    startLogic,
    startMessageApp;

startKafka = () => {
    console.log(`startKafka`);
    kafkaBus = kafkaBusFactory(kafkaHost, SERVICE_NAME, EventEmitter);
    kafkaService = kafkaServiceFactory(kafkaBus, EventEmitter);
    loggerAgent = loggerAgentFactory(SERVICE_NAME, kafkaService, EventEmitter);
    kafkaBus.producer.on('ready', startConfig);
};

setInterval(() => {
    console.log(`MEM: ${JSON.stringify(process.memoryUsage())}`);
}, 500);

startConfig = () => {
    console.log(`startConfig`);
    configObject = configObjectFactory(SERVICE_NAME, EventEmitter);
    configService = configServiceFactory(configObject, EventEmitter);
    configCtrl = configCtrlFactory(configService, kafkaService, EventEmitter);
    loggerAgent.listenLoggerEventsIn([configCtrl]);
    configCtrl.on('ready', startLogic);
    configCtrl.start();

};

startLogic = () => {
    startMessageApp();
};

startMessageApp = () => {
    console.log(`startMessageApp`);
    dbConfig = configService.read(`${SERVICE_NAME}.db`);
    dbConnectStr = buildMongoConStr(dbConfig);
    db = dbFactory(dbConnectStr, EventEmitter);
    messageService = messageServiceFactory(db, EventEmitter);
    messageCtrl = messageCtrlFactory(messageService, configService, kafkaService, EventEmitter);
    loggerAgent.listenLoggerEventsIn([messageCtrl]);
    messageService.start();
    messageCtrl.start();
};

startKafka();




