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
        if(context instanceof Error) {
            messageCtrl.emit('logger.agent.error', context);
            isValidData = false;
        }

        query = kafkaService.extractQuery(kafkaMessage);
        if(query instanceof Error) {
            messageCtrl.emit('logger.agent.error', query);
            isValidData = false;
        }

        data = kafkaService.extractWriteData(kafkaMessage);
        if(data instanceof Error) {
            messageCtrl.emit('logger.agent.error', data);
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

    messageCtrl.start = () => {
        kafkaListeners = configService.read('messagejs.kafkaListeners');
        if(kafkaListeners !== undefined) {
            kafkaService.subscribe(kafkaListeners.createMessage, createMessage);
        }
        else {
            let error = new Error('kafkaListeners undefined');
            messageCtrl.emit('logger.agent.error', error);
        }

        kafkaService.on('log', (messageString) => {
            messageCtrl.emit('logger.agent.log', 'kafkaService', messageString);
        });

        kafkaService.on('error', (err) => {
            messageCtrl.emit('logger.agent.error', err);
        });

        messageService.on('log', (messageString) => {
            messageCtrl.emit('logger.agent.log', 'messageService', messageString);
        });

        messageService.on('error', (err) => {
            messageCtrl.emit('logger.agent.error', err);
        });

        configService.on('log', (messageString) => {
            messageCtrl.emit('logger.agent.log', 'configService', messageString);
        });

        configService.on('error', (err) => {
            messageCtrl.emit('logger.agent.error', err);
        });


    };

    return messageCtrl;
};

