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

const dbFactory = require('./dbFactory.es6');
const kafkaBusFactory = require('my-kafka').kafkaBusFactory;
const kafkaServiceFactory = require('my-kafka').kafkaServiceFactory;

const configObjectFactory = require('./config/configObjectFactory.es6');
const configServiceFactory = require('./config/configServiceFactory.es6');
const configCtrlFactory = require('./config/configCtrlFactory.es6');

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
    configCtrl;

let dbConfig,
    dbConnectStr,
    kafkaListeners;


kafkaBus = kafkaBusFactory(kafkaHost, SERVICE_NAME);
kafkaService = kafkaServiceFactory(kafkaBus);

kafkaBus.producer.on('ready', ()=> {

    configObject = configObjectFactory(SERVICE_NAME);
    configObject.init().then(
        (config) => {
            configService = configServiceFactory(config);
            configCtrl = configCtrlFactory(configService, kafkaService);
            kafkaService.subscribe('get-config-response', configCtrl.writeConfig);
            kafkaService.send('get-config-request', configObject);
        },
        (error) => {
            console.log(JSON.stringify(error));
        }
    );

    configCtrl.on('ready', () => {
        dbConfig = configService.read(SERVICE_NAME, 'db');
        dbConnectStr = buildMongoConStr(dbConfig);
        db = dbFactory(dbConnectStr);

        messageService = messageServiceFactory(db);
        messageCtrl = messageCtrlFactory(messageService, kafkaService);

        kafkaListeners = configService.read(SERVICE_NAME, 'kafkaListeners');
        kafkaService.subscribe(kafkaListeners.createMessage, messageCtrl.createMessage);
    });


    // configService = configFactory(kafkaService);
    // configService.on('ready', ()=>{
    //     dbConfig = configService.get(SERVICE_NAME).db;
    //
    //     dbConnectStr = buildMongoConStr(dbConfig);
    //     db = dbFactory(dbConnectStr);
    //
    //     messageService = messageServiceFactory(db);
    //     messageCtrl = messageCtrlFactory(messageService,  kafkaService);
    //
    //     kafkaListeners = configService.get(SERVICE_NAME).kafkaListeners;
    //
    //     kafkaService.subscribe(kafkaListeners.createMessage, messageCtrl.createMessage);
    // });
});
