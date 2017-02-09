/**
 *Created by py on 27/11/2016
 */
"use strict";
module.exports = (messageService, configService, kafkaService, EventEmitter) => {

    let messageCtrl = new EventEmitter();

    let kafkaListeners;

    let createMessage;

    createMessage = kafkaMessage => {
        let context, query, data, topic, isValidData;

        isValidData = true;

        context = kafkaService.extractContext(kafkaMessage);
        if(context.error !== undefined) {
            let logMessage = messageCtrl.packLogMessage(this, `${context}`);
            messageCtrl.emit('logger.agent.error', logMessage);
            isValidData = false;
        }

        query = kafkaService.extractQuery(kafkaMessage);
        if(query.error !== undefined) {
            let logMessage = messageCtrl.packLogMessage(this, `${context}`);
            messageCtrl.emit('logger.agent.error', logMessage);
            isValidData = false;
        }

        data = kafkaService.extractWriteData(kafkaMessage);
        if(data.error !== undefined) {
            let logMessage = messageCtrl.packLogMessage(this, `${context}`);
            messageCtrl.emit('logger.agent.error', logMessage);
            isValidData = false;
        }

        topic = kafkaService.makeResponseTopic(kafkaMessage);

        if(isValidData) {
            messageService.create(query, data).then(
                (result) => {
                    context.response = result;
                    kafkaService.send(topic, context);
                },
                (error) => {
                    messageCtrl.emit('logger.agent.error', error);
                    context.response = error;
                    kafkaService.send(topic, context);
                }
            )
        }

    };

    kafkaListeners = configService.read('messagejs.kafkaListeners');
    if(kafkaListeners !== undefined) {
        kafkaService.subscribe(kafkaListeners.createMessage, createMessage);
    }
    else {
        let logMessage = messageCtrl.packLogMessage(this, 'kafkaListeners undefined');
        messageCtrl.emit('logger.agent.error', logMessage);
    }

    return messageCtrl;
};

