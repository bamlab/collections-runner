"use strict";
exports.__esModule = true;
// @ts-ignore
var fs = require("fs");
var postman_collection_1 = require("postman-collection");
var getDefaultVariables = function (flags) {
    // eslint-disable-next-line global-require
    var defaultEnvironment = require("../../../../postman/postman_environment.json");
    var defaultEnv = defaultEnvironment;
    if (flags && !flags.ciEnvironment) {
        try {
            // eslint-disable-next-line global-require, import/no-dynamic-require
            defaultEnv = require("../../../../postman/postman_environment.local.json");
        }
        catch (error) {
            console.log("PLEASE_CREATE_NEW_JSON_FILE at postman/postman_environment.local.json you can copy postman/postman_environment.json");
            console.log("USING postman/postman_environment.json");
            // eslint-disable-next-line global-require, import/no-dynamic-require
            defaultEnv = require("../../../../postman/postman_environment.json");
        }
    }
    return new postman_collection_1.VariableScope(defaultEnv);
};
var setCustomVariables = function (environment, variables) {
    for (var i = 0; i < variables.length; i += 1) {
        var touple = variables[i].split(":");
        if (touple.length < 2) {
            throw new Error("Malformed variable: " + variables[i]);
        }
        environment.set(touple[0], touple[1], "string");
    }
};
exports.setEnvironmentVariables = function (flags) {
    var environment = getDefaultVariables(flags);
    if (flags && flags.dev) {
        var defaultEnv = require("../../../../postman/default.dev.json");
        for (var _i = 0, _a = Object.entries(defaultEnv); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            environment.set(key, value, "string");
        }
    }
    if (flags && flags.staging) {
        var defaultEnv = require("../../../../postman/default.staging.json");
        for (var _c = 0, _d = Object.entries(defaultEnv); _c < _d.length; _c++) {
            var _e = _d[_c], key = _e[0], value = _e[1];
            environment.set(key, value, "string");
        }
    }
    if (flags && flags.vars) {
        var variables = flags.vars.split(",");
        setCustomVariables(environment, variables);
    }
    return environment;
};
exports.saveEnvironmentVariables = function (environment) {
    var formattedEnvironnement = JSON.stringify(environment.toJSON(), null, 2);
    fs.writeFileSync("./postman/postman_environment.local.json", formattedEnvironnement);
};
