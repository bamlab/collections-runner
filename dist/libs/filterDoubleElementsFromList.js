"use strict";
exports.__esModule = true;
var isElementInArray = function (list, element, equalityCriteria) {
    var foundElement = list.find(function (el) { return equalityCriteria(el, element); });
    return !!foundElement;
};
exports.filterDoubleElementsFromList = function (list, equalityCriteria) {
    var listWithoutDoubleElements = [];
    list.forEach(function (element) {
        if (!isElementInArray(listWithoutDoubleElements, element, equalityCriteria)) {
            listWithoutDoubleElements.push(element);
        }
    });
    return listWithoutDoubleElements;
};
