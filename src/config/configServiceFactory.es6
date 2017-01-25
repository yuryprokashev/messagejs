/**
 *Created by py on 24/01/2017
 */
'use strict';
module.exports = configObject => {
    let configService = {};

    configService.read = (serviceName, propertyName) => {
        if(propertyName !== undefined && configObject[serviceName][propertyName] !== undefined) {
            return configObject[serviceName][propertyName];
        }
        else if(serviceName !== undefined && configObject[serviceName] !== undefined) {
            return configObject[serviceName];
        }
        else if(configObject !== undefined) {
            return configObject;
        }
        else {
            return null;
        }
    };

    configService.write = (configData) => {
        configObject = configData;
    };
    return configService;
};