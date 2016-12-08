/**
 *Created by py on 27/11/2016
 */
"use strict";

module.exports = db => {
    let Message = db.model("Message", require('./messageSchema.es6'), 'messages');
    const guid = require('../guid.js');
    const messageService = {};
    messageService.create = (message) => {
        return new Promise(
            (resolve, reject) => {
                Message.create(
                    {
                        _id: guid(),
                        occuredAt: message.requestPayload.occuredAt,
                        storedAt: new Date().valueOf(),
                        sourceId: message.requestPayload.sourceId,
                        userId: message.requestPayload.user,
                        payload: JSON.stringify(message.requestPayload.payload),
                        userToken: message.requestPayload.userToken,
                        commandId: message.requestPayload.commandId
                    },
                    (err, result) => {
                        if(err){ return reject(err);}
                        resolve(result);
                    }
                )
            }
        );
    };
    return messageService;
};