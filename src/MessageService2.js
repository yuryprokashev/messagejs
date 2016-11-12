/**
 * Created by py on 04/11/2016.
 */
'use strict';

const KafkaAdapter = require('./KafkaAdapter2');
const  guid = require('./guid');
const KAFKA_TEST = "54.154.211.165";
const KAFKA_PROD = "54.154.226.55";
const mongoose = require('mongoose');
const MyDates = require('./MyDates');
const EventEmitter = require('events').EventEmitter;

class MessageService extends EventEmitter {
    constructor(isProd){
        super();
        var _this = this;
        if(isProd === undefined){
            throw new Error('isProd flag is missing');
        }
        this.serviceName = 'Message-Service';
        this.kafkaHost = (function(bool){
            let result = bool ? KAFKA_PROD : KAFKA_TEST;
            console.log(result);
            return result;
        })(isProd);
        this.bus = new KafkaAdapter(this.kafkaHost, this.serviceName, 2);
        let requestId = guid();
        this.bus.producer.on('ready', function(){
            _this.bus.subscribe('get-config-response', _this.configure);
            _this.bus.send('get-config-request', {requestId: requestId});
        });
        this.configure = function (msg) {
            let message = JSON.parse(msg.value);
            if(message.requestId === requestId){
                // console.log(message.responsePayload[0].db.dbURL);
                let dbURL = message.responsePayload[0].db.dbURL;
                _this.emit('config-ready', {dbURL: dbURL});
            }
        };
        this.on('config-ready', function (args) {
            // console.log(args);
            mongoose.connect(args.dbURL);
            let schema = require('./message.schema');
            _this.m = mongoose.model('Message', schema, 'messages');
            _this.bus.subscribe('message-new', handleNewClientMessage);
            function handleNewClientMessage(msg) {
                var message = JSON.parse(msg.value);
                var _id = guid();
                var response = {
                    requestId: message.requestId,
                    responsePayload: {},
                    responseErrors: []
                };
                _this.m.create(
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
                            _this.bus.send('message-done', response);
                        }
                        else if(result){
                            response.responsePayload = result;
                            _this.bus.send('message-done', response);
                        }
                    });
            }
            _this.emit('message-ready',{});
        });
        this.on('message-ready', function(args){
            console.log(`${_this.serviceName} bootstrapped`);
        });
    }
}
module.exports = MessageService;