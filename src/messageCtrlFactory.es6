/**
 *Created by py on 27/11/2016
 */
"use strict";
module.exports = (messageService, configService, kafkaService) => {

    let messageCtrl = {};

    let kafkaListeners;

    let createMessage;

    createMessage = kafkaMessage => {
        let context, query, data;

        context = kafkaService.extractContext(kafkaMessage);
        query = kafkaService.extractQuery(kafkaMessage);
        data = kafkaService.extractWriteData(kafkaMessage);

        messageService.create(query, data).then(
            (result) => {
                context.response = result;
                kafkaService.send(kafkaService.makeResponseTopic(kafkaMessage), context);
            },
            (error) => {
                context.response = error;
                kafkaService.send(kafkaService.makeResponseTopic(kafkaMessage), context);
            }
        )
    };

    kafkaListeners = configService.read('messagejs.kafkaListeners');
    if(kafkaListeners !== undefined) {
        kafkaService.subscribe(kafkaListeners.createMessage, createMessage);
    }

    return messageCtrl;
};

