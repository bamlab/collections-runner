"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var inquirer_1 = require("inquirer");
var filterDoubleElementsFromList_1 = require("../libs/filterDoubleElementsFromList");
var automator_collections_services_1 = require("./automator.collections.services");
var usedCollection = require("../../../../postman/postman_collection.json");
var _a = automator_collections_services_1.getCollectionDetails(usedCollection), parentsRoutesNames = _a.parentsRoutesNames, childrenRoutesNames = _a.childrenRoutesNames, usedVariables = _a.usedVariables;
var getEnvironmentDetails = function (choosenEnvironment) {
    if (choosenEnvironment === "ci") {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        return require("../../../../postman/postman_environment.json");
    }
    try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        return require("../../../../postman/postman_environment.local.json");
    }
    catch (error) {
        console.log("PLEASE_CREATE_NEW_JSON_FILE at postman/postman_environment.local.json you can copy postman/postman_environment.json");
        console.log("USING postman/postman_environment.json");
        // eslint-disable-next-line global-require, import/no-dynamic-require
        return require("../../../../postman/postman_environment.json");
    }
};
exports.getEnvironmentVariablesDetails = function (answers) {
    var wantedEnvironment = answers.useLocalEnvironment ? "local" : "ci";
    var environment = getEnvironmentDetails(wantedEnvironment);
    // @ts-ignore
    var usedVariablesInSelectedRoutes = [];
    Object.keys(usedVariables)
        .filter(function (key) { return answers.routes.includes(key); })
        // @ts-ignore
        .forEach(function (key) {
        // @ts-ignore
        return usedVariablesInSelectedRoutes.push.apply(usedVariablesInSelectedRoutes, usedVariables[key]);
    });
    usedVariablesInSelectedRoutes = filterDoubleElementsFromList_1.filterDoubleElementsFromList(
    // @ts-ignore
    usedVariablesInSelectedRoutes, 
    // @ts-ignore
    function (stringA, stringB) { return stringA === stringB; });
    var notAvailable = "notAvailable";
    // @ts-ignore
    var availablevariables = environment.values.map(function (variable) {
        // @ts-ignore
        if (usedVariablesInSelectedRoutes.includes(variable.key)) {
            return variable.key + ": " + variable.value;
        }
        return notAvailable;
    });
    return availablevariables.filter(function (variable) { return variable !== notAvailable; });
};
exports.noHelpWanted = function (answers) {
    return answers.help === "Use the tool";
};
exports.defaultchoices = __spreadArrays([
    new inquirer_1.Separator("---------- Macro routes ----------")
], parentsRoutesNames, [
    new inquirer_1.Separator("---------- All available routes ----------")
], childrenRoutesNames);
