/**
 *Created by py on 27/11/2016
 */
"use strict";
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
const kafkaBusFactory = require('./kafkaBusFactory.es6');
const kafkaServiceFactory = require('./kafkaServiceFactory.es6');
const configFactory = require('./configFactory.es6');
const messageCtrlFactory = require('./messageCtrlFactory.es6');
const messageServiceFactory = require('./messageServiceFactory.es6');


const kafkaBus = kafkaBusFactory(kafkaHost, 'Message-Service');
const kafkaService = kafkaServiceFactory(kafkaBus);

let configService, messageCtrl, messageService, db;

kafkaBus.producer.on('ready', ()=> {
    configService = configFactory(kafkaService);
    configService.on('ready', ()=>{
        let config = configService.get();
        db = dbFactory(config.db.dbURL);
        messageService = messageServiceFactory(db);
        messageCtrl = messageCtrlFactory(messageService,  kafkaService);
        kafkaService.subscribe('create-message-request', messageCtrl.createMessage);
    });
});
