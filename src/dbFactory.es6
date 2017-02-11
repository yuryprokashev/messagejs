/**
 *Created by py on 14/11/2016
 */
'use strict';
const Mongoose = require('mongoose');

module.exports = (dbURL, EventEmitter) => {

    let connection = Mongoose.connect(dbURL);
    Mongoose.connection.on('connected',()=>{
        connection.emit('connected');
    });
    Mongoose.connection.on('error', ()=>{
        let error = new Error(`mongoose failed to connect to ${dbURL}`);
        connection.emit('error', error);
    });
    Mongoose.connection.on('disconnected', ()=>{
        connection.emit('disconnected', {message: `disconnected from ${dbURL}`});
    });
    process.on('SIGINT', ()=>{
        Mongoose.connection.close(()=>{
            console.log('close db connection due to node app exit');
            connection.emit('close', {message: 'connection closed due to SIGINT'});
            process.exit(0);
        });
    });
    return connection;
};