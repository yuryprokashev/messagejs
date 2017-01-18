/**
 *Created by py on 27/11/2016
 */
"use strict";
module.exports = (messageService, kafkaService) => {
    const extractContext = (kafkaMessage) => {
        let context;
        context = JSON.parse(kafkaMessage.value);
        if(context === undefined) {
            let newContext = {};
            newContext.response = {error: 'arrived context is empty'};
            kafkaService.send(makeResponseTopic(kafkaMessage), newContext);
        }
        return context;
    };

    const extractQuery = (kafkaMessage) => {
        let query = JSON.parse(kafkaMessage.value).request.query;
        if(query === undefined || query === null) {
            let context;
            context = extractContext(kafkaMessage);
            context.response = {error: 'query is empty'};
            kafkaService.send(makeResponseTopic(kafkaMessage), context);
        }
        else {
            return query;
        }
    };

    const extractWriteData =(kafkaMessage) => {
        let profile = JSON.parse(kafkaMessage.value).request.writeData;
        if(profile === undefined || profile === null) {
            let context;
            context = extractContext(kafkaMessage);
            context.response = {error: 'profile is empty'};
            kafkaService.send(makeResponseTopic(kafkaMessage), context);
        }
        else {
            return profile;
        }
    };

    const makeResponseTopic = (kafkaMessage) => {
        let re = /-request/;
        return kafkaMessage.topic.replace(re, '-response');
    };

    let messageCtrl = {};

    messageCtrl.createMessage = (kafkaMessage) => {
        let context, query, data;

        context = extractContext(kafkaMessage);
        query = extractQuery(kafkaMessage);
        data = extractWriteData(kafkaMessage);

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