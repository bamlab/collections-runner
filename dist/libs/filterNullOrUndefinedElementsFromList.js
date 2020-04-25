"use strict";
exports.__esModule = true;
exports.filterNullOrUndefinedElementsFromList = function (list) {
    var listWithoutEmptyElements = [];
    for (var index = 0; index < list.length; index++) {
        var element = list[index];
        if (element !== null && element !== undefined) {
            listWithoutEmptyElements.push(element);
        }
    }
    return listWithoutEmptyElements;
};
