/**
 *Created by py on 27/11/2016
 */
"use strict";
module.exports = (messageService, kafkaService) => {
    let messageCtrl = {};

    messageCtrl.subscribe = (topic, callback) => {
        kafkaService.subscribe(topic, callback);
    };

    messageCtrl.createMessage = (message) => {
        let response = {
            requestId: message.requestId,
            responsePayload: {},
            responseErrors: []
        };
        messageService.create(message).then(
            (result) => {
                response.responsePayload = result;
                kafkaService.send("message-done", response);
            },
            (error) => {
                response.responseErrors.push(error);
                kafkaService.send("message-done", response);
            }
        )

    };

    return messageCtrl;
};