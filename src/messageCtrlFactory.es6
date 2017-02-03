/**
 *Created by py on 27/11/2016
 */
"use strict";
module.exports = (messageService, configService, kafkaService) => {

    let messageCtrl = {};

    let kafkaListeners,
        isSignedRequest;

    let createMessage;

    createMessage = kafkaMessage => {
        let context, query, data, signRequest;

        context = kafkaService.extractContext(kafkaMessage);
        query = kafkaService.extractQuery(kafkaMessage);
        data = kafkaService.extractWriteData(kafkaMessage);
        signRequest = false;

        messageService.create(query, data).then(
            (result) => {
                context.response = result;
                kafkaService.send(makeResponseTopic(kafkaMessage), signRequest, context);
            },
            (error) => {
                context.response = error;
                kafkaService.send(makeResponseTopic(kafkaMessage), signRequest, context);
            }
        )
    };



    kafkaListeners = configService.read('messagejs.kafkaListeners');
    isSignedRequest = false;
    kafkaService.subscribe(kafkaListeners.createMessage, isSignedRequest, createMessage);


    return messageCtrl;
};

