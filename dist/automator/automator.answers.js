"use strict";
exports.__esModule = true;
// @ts-ignore
var child_process_1 = require("child_process");
// @ts-ignore
var copyToClipBoard = function (data) {
    var proc = child_process_1.spawn("pbcopy");
    // @ts-ignore
    proc.stdin.write(data);
    // @ts-ignore
    proc.stdin.end();
};
exports.logCommandToUse = function (answers) {
    var commandeToUse = computeCommandToUse(answers);
    copyToClipBoard(commandeToUse);
    // eslint-disable-next-line no-console
    console.log("command has been copy to clipboard", commandeToUse);
};
var computeCommandToUse = function (answers) {
    if (answers.help !== "none") {
        return logHelpCommands(answers.help);
    }
    return computeCommandToUseWithoutHelp(answers);
};
var updateCustomCommand = function (customCommand, newCommand) {
    return customCommand.concat(newCommand);
};
var computeCommandToUseWithoutHelp = function (answers) {
    var customCommand = "yarn collections-runner";
    if (answers.routes.length) {
        // @ts-ignore
        answers.routes.forEach(function (route) {
            customCommand = updateCustomCommand(customCommand, " \"" + route + "\"");
        });
    }
    if (answers.environment === "development") {
        customCommand = updateCustomCommand(customCommand, " --dev");
    }
    if (answers.environment === "staging") {
        customCommand = updateCustomCommand(customCommand, " --staging");
    }
    if (!answers.useLocalEnvironment) {
        customCommand = updateCustomCommand(customCommand, " --ciEnvironment");
    }
    if (!answers.updateEnvironment) {
        customCommand = updateCustomCommand(customCommand, " --updateLocalEnvironment=false");
    }
    if (answers.devVariables.length) {
        customCommand = updateCustomCommand(customCommand, " --vars=");
        // @ts-ignore
        answers.devVariables.forEach(function (variable) {
            var variableInfo = variable.split(":");
            var variableName = variableInfo[0];
            customCommand = updateCustomCommand(customCommand, variableName + ":VALUE,");
        });
        customCommand = customCommand.slice(0, -1);
    }
    return customCommand;
};
var logHelpCommands = function (helpCommand) {
    if (helpCommand === "routes") {
        return "yarn collections-runner --routes";
    }
    // eslint-disable-next-line no-console
    console.log("this feature is not implemented yet");
    return "yarn collections-runner --help";
};
