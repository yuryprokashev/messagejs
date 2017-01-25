/**
 *Created by py on 27/11/2016
 */
"use strict";
module.exports = (messageService, kafkaService) => {

    let messageCtrl = {};

    messageCtrl.createMessage = (kafkaMessage) => {
        let context, query, data;

        context = kafkaService.extractContext(kafkaMessage);
        query = kafkaService.extractQuery(kafkaMessage);
        data = kafkaService.extractWriteData(kafkaMessage);

        messageService.create(query, data).then(
            (result) => {
                context.response = result;
                kafkaService.send(makeResponseTopic(kafkaMessage), context);
            },
            (error) => {
                context.response = error;
                kafkaService.send(makeResponseTopic(kafkaMessage), context);
            }
        )
    };


    return messageCtrl;
};

