"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var filterDoubleElementsFromList_1 = require("../libs/filterDoubleElementsFromList");
var filterNullOrUndefinedElementsFromList_1 = require("../libs/filterNullOrUndefinedElementsFromList");
var getOddIndexes = function (matching) {
    // @ts-ignore
    var onlyOddElements = [];
    // @ts-ignore
    if (matching.length < 2)
        return onlyOddElements;
    // eslint-disable-next-line
    for (var index = 1; index < matching.length; index = index + 2) {
        onlyOddElements.push(matching[index]);
    }
    return onlyOddElements;
};
var getGetVariableCall = function (events) {
    return [].concat.apply([], events.map(function (event) {
        // @ts-ignore script is typed as possibly string
        var script = event.script.exec.join("");
        var getEnvironementString = /.*pm.environment.get\("(.*)"\).*/i;
        var matchingString = script.split(getEnvironementString);
        return getOddIndexes(matchingString);
    }));
};
var getGetVariableUse = function (body) {
    var getEnvironementString = /.*{{(.*)}}.*/i;
    var matchingString = body.split(getEnvironementString);
    return getOddIndexes(matchingString);
};
var computeChildrenUsedVariables = function (element) {
    var usedInEvent = element.event
        ? filterNullOrUndefinedElementsFromList_1.filterNullOrUndefinedElementsFromList(getGetVariableCall(element.event))
        : [];
    // @ts-ignore ItemGroupDefinition type does not include request key
    var usedInBody = element.request.body && element.request.body.raw
        // @ts-ignore
        ? getGetVariableUse(element.request.body.raw)
        : [];
    // @ts-ignore ItemGroupDefinition type does not include request key
    var usedInHeader = getGetVariableUse(
    // @ts-ignore
    element.request.header.map(function (key) { return key.value; }).join(""));
    // @ts-ignore ItemGroupDefinition type does not include request key
    var usedInURL = getGetVariableUse(element.request.url.raw);
    return __spreadArrays(usedInEvent, usedInBody, usedInHeader, usedInURL);
};
var addChildrenVariablesToParent = function (parentUsedVariables, childrenUsedVariables) {
    var newParentUsedVariables = parentUsedVariables;
    newParentUsedVariables.push.apply(newParentUsedVariables, childrenUsedVariables);
    return filterDoubleElementsFromList_1.filterDoubleElementsFromList(newParentUsedVariables, 
    // @ts-ignore
    function (stringA, stringB) { return stringA === stringB; });
};
exports.getCollectionDetails = function (collection) {
    // @ts-ignore
    var parentsRoutesNames = [];
    // @ts-ignore
    var childrenRoutesNames = [];
    var usedVariables = {};
    var initializeRoutesNames = function () {
        // @ts-ignore
        collection.item.forEach(function (ele) {
            // @ts-ignore
            getRoutesName(ele, collection.name);
        });
    };
    var getRoutesName = function (element, parentName) {
        if (!element.item || element.item.length == 0) {
            childrenRoutesNames.push(element.name);
            // @ts-ignore
            usedVariables[element.name] = computeChildrenUsedVariables(element);
            // @ts-ignore
            usedVariables[parentName] = addChildrenVariablesToParent(
            // @ts-ignore
            usedVariables[parentName], computeChildrenUsedVariables(element));
            return;
        }
        parentsRoutesNames.push(element.name);
        // @ts-ignore
        usedVariables[element.name] = [];
        element.item.forEach(function (ele) {
            // @ts-ignore
            getRoutesName(ele, element.name);
        });
    };
    initializeRoutesNames();
    // @ts-ignore
    return { parentsRoutesNames: parentsRoutesNames, childrenRoutesNames: childrenRoutesNames, usedVariables: usedVariables };
};
