/**
 * Created by py on 09/08/16.
 */

var MessageService;
var MyDates = require('./MyDates');
var guid = require("./guid");

MessageService = function(m, b) {

    // function: store the Message in 'messages' collection.
    var handleNewClientMessage = function(msg){
        var message = JSON.parse(msg.value);
        var _id = guid();
        var response = {
            requestId: message.requestId,
            responsePayload: {},
            responseErrors: []
        };
        console.log(message);
        m.create(
            {
                _id: _id,
                occuredAt: message.requestPayload.occuredAt,
                storedAt: MyDates.now(),
                sourceId: message.requestPayload.sourceId,
                userId: message.requestPayload.user,
                payload: JSON.stringify(message.requestPayload.payload),
                userToken: message.requestPayload.userToken,
                commandId: message.requestPayload.commandId
            },
            function(err, result){
                if(err){
                    response.responseErrors.push(err);
                    b.send('message-done', response);
                }
                else if(result){
                    response.responsePayload = result;
                    b.send('message-done', response);
                }
            }
            );
    };
    // MessageService starts listening for 'message-new' POST requests.
    b.subscribe('message-new', handleNewClientMessage);
};

module.exports = MessageService;