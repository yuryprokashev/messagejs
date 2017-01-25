/**
 *Created by py on 24/01/2017
 */
'use strict';
module.exports = configObject => {
    let configService = {};

    configService.read = (serviceName, propertyName) => {
        if(propertyName !== undefined) {
            return configObject[serviceName][propertyName];
        }
        else if(serviceName !== undefined) {
            return configObject[serviceName];
        }
        else {
            return configObject;
        }
    };

    configService.write = (configData) => {
        configObject = configData;
    };
    return configService;
};