/**
 *Created by py on 24/01/2017
 */
'use strict';
const dns = require('dns');
const os = require('os');
module.exports = (serviceName) => {
    let configObject = {};
    let hostName;

    configObject.serviceName = serviceName;

    hostName = os.hostname();
    dns.lookup(hostName, {family: 4},(err, address, family) => {
        configObject.serviceIP = address;
        console.log(`configObject is ${JSON.stringify(configObject)}`);
        return configObject;
    });
};