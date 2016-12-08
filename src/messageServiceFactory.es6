/**
 *Created by py on 27/11/2016
 */
"use strict";

module.exports = db => {
    let Message = db.model("Message", require('./messageSchema.es6'), 'messages');
    const guid = require('./guid.es6');
    const messageService = {};
    messageService.create = (parsedMessage) => {
        return new Promise(
            (resolve, reject) => {
                Message.create(
                    {
                        _id: guid(),
                        occuredAt: parsedMessage.requestPayload.occuredAt,
                        storedAt: new Date().valueOf(),
                        sourceId: parsedMessage.requestPayload.sourceId,
                        userId: parsedMessage.requestPayload.user,
                        payload: JSON.stringify(parsedMessage.requestPayload.payload),
                        userToken: parsedMessage.requestPayload.userToken,
                        commandId: parsedMessage.requestPayload.commandId
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