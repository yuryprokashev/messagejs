/**
 *Created by py on 14/11/2016
 */
'use strict';
const Mongoose = require('mongoose');

module.exports = (dbURL, EventEmitter) => {

    let db = new EventEmitter();

    db.connection = Mongoose.connect(dbURL);

    Mongoose.connection.on('connected',()=>{
        db.emit('log', `mongoose connected to ${dbURL}`);
    });
    Mongoose.connection.on('error', ()=>{
        let error = new Error(`mongoose failed to connect to ${dbURL}`);
        db.emit('error', error);
    });
    Mongoose.connection.on('disconnected', ()=>{
        db.emit('log', `mongoose disconnected from ${dbURL}`);
    });
    process.on('SIGINT', ()=>{
        Mongoose.connection.close(()=>{
            db.emit('log', 'connection closed due to SIGINT');
            process.exit(0);
        });
    });
    return db;
};