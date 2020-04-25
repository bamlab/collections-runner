"use strict";
exports.__esModule = true;
var newman = require("newman");
var meow = require("meow");
var runner_setEnvironnement_1 = require("./runner.setEnvironnement");
var runner_displayHelpInfo_1 = require("./runner.displayHelpInfo");
var collection = require("../../../../postman/postman_collection.json");
var defaultEnvironment = require("../../../../postman/postman_environment.json");
var booleanTag = "boolean";
var stringTag = "string";
var runCollections = function (flags, folders) {
    var environment = runner_setEnvironnement_1.setEnvironmentVariables(flags);
    // @ts-ignore
    var displayResponseBody = function (error, args) {
        if (!args.response) {
            // eslint-disable-next-line no-console
            console.log("PLEASE_LAUNCH_YOUR_LOCAL_SERVER");
            return;
        }
        // eslint-disable-next-line no-console
        console.log(args.response.stream.toString());
    };
    newman
        .run({
        collection: collection,
        environment: environment,
        reporters: "cli",
        folder: folders,
        bail: true
    }, function () {
        flags.updateLocalEnvironment && runner_setEnvironnement_1.saveEnvironmentVariables(environment);
    })
        .on("request", displayResponseBody);
};
var run = function (folders, flags) {
    var shouldRunCollections = !flags.routes && !flags.environment;
    runner_displayHelpInfo_1.displayAvailableRoutes(collection, flags);
    runner_displayHelpInfo_1.displayAvailableEnvironmentVariable(defaultEnvironment, flags);
    if (shouldRunCollections) {
        runCollections(flags, folders);
    }
};
var possibleFlags = {
    vars: {
        type: stringTag
    },
    dev: {
        type: booleanTag,
        "default": false
    },
    staging: {
        type: booleanTag,
        "default": false
    },
    routes: {
        type: booleanTag,
        "default": false
    },
    environment: {
        type: booleanTag,
        "default": false
    },
    ciEnvironment: {
        type: booleanTag,
        "default": false
    },
    updateLocalEnvironment: {
        type: booleanTag,
        "default": true
    }
};
var cli = meow(runner_displayHelpInfo_1.helpMessage, {
    flags: possibleFlags
});
exports.collectionsRunner = function () {
    run(cli.input, cli.flags);
};
