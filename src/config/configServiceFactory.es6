/**
 *Created by py on 24/01/2017
 */
'use strict';
module.exports = configObject => {
    let configService = {};
    let config;

    config = configObject;

    configService.read = (serviceName, propertyName) => {

        if(config !== undefined) {
            if(serviceName !== undefined && config[serviceName] !== undefined) {
                if(propertyName !== undefined && config[serviceName][propertyName] !== undefined) {
                    return config[serviceName][propertyName];
                }
                else {
                    return config[serviceName];
                }
            }
            else {
                return config;
            }
        }
        else {
            return null;
        }
    };

    configService.write = (configData) => {
        config = configData;
    };
    return configService;
};