"use strict";
exports.__esModule = true;
// @ts-ignore
var logTree = require("console-log-tree");
var parseChildren = function (folders) {
    // @ts-ignore
    return folders.map(function (folder) {
        return {
            name: folder.name,
            children: folder.item && parseChildren(folder.item)
        };
    });
};
var parseCollection = function (collection) {
    return {
        // @ts-ignore
        name: collection.info.name,
        children: collection.item && parseChildren(collection.item)
    };
};
var displayAvailableRoutesWhenAskedTo = function (collection) {
    var collectionTree = logTree.parse(parseCollection(collection));
    // eslint-disable-next-line no-console
    console.log(collectionTree);
};
exports.displayAvailableRoutes = function (collection, flags) {
    if (flags.routes) {
        displayAvailableRoutesWhenAskedTo(collection);
    }
};
var parseEnvironment = function (environment) {
    // @ts-ignore
    return environment.values.map(function (variable) { return ({
        name: variable.key,
        children: [{ name: variable.value }]
    }); });
};
var displayAvailableEnvironmentVariableWhenAskedTo = function (environment) {
    var environmentTree = logTree.parse(parseEnvironment(environment));
    // eslint-disable-next-line no-console
    console.log(environmentTree);
};
exports.displayAvailableEnvironmentVariable = function (environment, flags) {
    if (flags.environment) {
        displayAvailableEnvironmentVariableWhenAskedTo(environment);
    }
};
exports.helpMessage = "\nUsage\n  $ tsc ./runCollections.ts && ./runCollections.js <folders> --vars=<variables>\n\nArguments:\n  folders: A space-separated list of folders tu run, in given order.\n  Example: ./runCollections.js Registration VLS_Booking\n\nOptions:\n  --vars A comma-separated list of variables in name:value format\n    Example: ./runCollections.js Register --vars=email:toto@gmail.com,password:pass\n    Warning: commas and colons are not supported in vars for the moment. Make a PR if you need one.\n  --dev A boolean specifying if collections should be ran on dev API\n    Example: ./runCollections.js Register --dev\n    Warning: by default collections are ran on local environment file config\n  --staging A boolean specifying if collections should be ran on staging API\n    Example: ./runCollections.js Register --staging\n    Warning: by default collections are ran on local environment file config\n  --routes A boolean specifying if collections list should be displayed on the console\n    Example: ./runCollections.js Register --routes\n  --environment A boolean specifying if possible environment variable list should be displayed on the console\n    Example: ./runCollections.js Register --environment\n  --ciEnvironment A boolean specifying if default ci environment should be loaded\n    Example: ./runCollections.js Register --ciEnvironment\n    Warning: by default postman_environment.local.json is used\n  --updateLocalEnvironment A boolean specifying if local environment variables should be overridden after running collections \n    Example: ./runCollections.js Register --updateLocalEnvironment\n    Warning: by default postman_environment.local.json is overridden by the new environement variables\n  --reporter A string specifying an additional reporter (if not specified, only reporter will be \"cli\")\n    Example: ./runCollections.js Register --reporter=html\n    Warning: To make it work, you will need to add the specified reporter npm package dependency to your project\n  --reporterPath A string specifying your additional reporter export path (only work if reporter flag specified)\n    Example: ./runCollections.js Register --reporter=html --reporterPath='./newman/output/report.html'\n";
