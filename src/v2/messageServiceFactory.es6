/**
 *Created by py on 27/11/2016
 */
"use strict";

module.exports = db => {
    let Message = db.model("Message", require('./messageSchema.es6'), 'messages');
    const guid = require('../guid.js');
    const messageService = {};
    messageService.create = (message) => {
        let messageVal = JSON.parse(message.value);
        return new Promise(
            (resolve, reject) => {
                Message.create(
                    {
                        _id: guid(),
                        occuredAt: messageVal.requestPayload.occuredAt,
                        storedAt: new Date().valueOf(),
                        sourceId: messageVal.requestPayload.sourceId,
                        userId: messageVal.requestPayload.user,
                        payload: JSON.stringify(messageVal.requestPayload.payload),
                        userToken: messageVal.requestPayload.userToken,
                        commandId: messageVal.requestPayload.commandId
                    },
                    (err, result) => {
                        if(err){ return reject(err);}
                        console.log(result);
                        resolve(result);
                    }
                )
            }
        );
    };
    return messageService;
};