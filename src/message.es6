/**
 *Created by py on 27/11/2016
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

const dbFactory = require('./dbFactory.es6');
// const kafkaBusFactory = require('./kafkaBusFactory.es6');
// const kafkaServiceFactory = require('./kafkaServiceFactory.es6');

const kafkaBusFactory = require('my-kafka').kafkaBusFactory;
const kafkaServiceFactory = require('my-kafka').kafkaServiceFactory;
const configFactory = require('./configFactory.es6');
const messageCtrlFactory = require('./messageCtrlFactory.es6');
const messageServiceFactory = require('./messageServiceFactory.es6');
const buildMongoConStr = require('./helpers/buildConnString.es6');

let kafkaBus,
    db;

let kafkaService,
    configService,
    messageService;

let messageCtrl;

let dbConfig,
    dbConnectStr,
    kafkaListeners;


kafkaBus = kafkaBusFactory(kafkaHost, SERVICE_NAME);
kafkaService = kafkaServiceFactory(kafkaBus);

kafkaBus.producer.on('ready', ()=> {
    configService = configFactory(kafkaService);
    configService.on('ready', ()=>{
        dbConfig = configService.get(SERVICE_NAME).db;

        dbConnectStr = buildMongoConStr(dbConfig);
        db = dbFactory(dbConnectStr);

        messageService = messageServiceFactory(db);
        messageCtrl = messageCtrlFactory(messageService,  kafkaService);

        kafkaListeners = configService.get(SERVICE_NAME).kafkaListeners;

        kafkaService.subscribe(kafkaListeners.createMessage, messageCtrl.createMessage);
    });
});
