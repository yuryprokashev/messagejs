/**
 *Created by py on 27/11/2016
 */
"use strict";
module.exports = (messageService, kafkaService) => {
    let messageCtrl = {};

    messageCtrl.createMessage = (message) => {
        messageService.create(message).then(
            (result) => {
                kafkaService.send("message-done", result);
            },
            (error) => {
                kafkaService.send("message-done", error);
            }
        )

    };

    return messageCtrl;
};