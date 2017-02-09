/**
 *Created by py on 27/11/2016
 */
"use strict";

module.exports = (db, EventEmitter) => {
    let Message = db.model("Message", require('./messageSchema.es6'), 'messages');
    const guid = require('./helpers/guid.es6');
    const messageService = new EventEmitter();
    messageService.create = (query, data) => {
        return new Promise(
            (resolve, reject) => {
                Message.create(
                    {
                        _id: guid(),
                        occurredAt: data.occurredAt,
                        // storedAt: new Date().valueOf(),
                        sourceId: data.sourceId,
                        userId: data.userId,
                        payload: JSON.stringify(data.payload),
                        userToken: data.userToken,
                        commandId: data.commandId
                    },
                    (err, result) => {
                        if(err){
                            let logMessage = messageService.packLogMessage(this, `failed to create message\n${err}`);
                            return reject(logMessage);
                        }
                        resolve(result);
                    }
                )
            }
        );
    };
    return messageService;
};