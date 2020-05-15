import * as newman from "newman";
import * as meow from "meow";
import {
  setEnvironmentVariables,
  saveEnvironmentVariables
} from "./runner.setEnvironnement";
import {
  displayAvailableRoutes,
  displayAvailableEnvironmentVariable,
  helpMessage
} from "./runner.displayHelpInfo";
import { flagsTypes } from "./runner.runCollections.types";

const collection = require("../../../../postman/postman_collection.json");
const defaultEnvironment = require("../../../../postman/postman_environment.json");

const booleanTag: meow.FlagType = "boolean";
const stringTag: meow.FlagType = "string";

const runCollections = (
  flags: flagsTypes,
  folders: string | string[]
): void => {
  const environment = setEnvironmentVariables(flags);

  // @ts-ignore
  const displayResponseBody = (error, args: any): void => {
    if (!args.response) {
      // eslint-disable-next-line no-console
      console.log("PLEASE_LAUNCH_YOUR_LOCAL_SERVER");
      return;
    }
    // eslint-disable-next-line no-console
    console.log(args.response.stream.toString());
  };

  const runCallBack = (
    error: Error | null,
    summary: newman.NewmanRunSummary
  ): void => {
    flags.updateLocalEnvironment && saveEnvironmentVariables(environment);
    let errorToDisplay;
    if (error) errorToDisplay = error;
    if (summary.run.failures.length)
      errorToDisplay =
        summary.run.failures[0].error.name +
        " " +
        summary.run.failures[0].error.message;
    if (errorToDisplay) {
      console.log("Collection run encountered an error.", errorToDisplay);
      process.exitCode = 1;
    } else {
      console.log("Collection run with success!");
    }
  };

  const reporters = ["cli"];
  let reporter = {};
  if (flags.reporter) {
    reporters.push(flags.reporter);
    if (flags.reporterPath)
      reporter = {
        [flags.reporter]: { export: flags.reporterPath }
      };
  }

  newman
    .run({
      collection,
      environment,
      reporters,
      reporter,
      folder: folders,
      bail: true
    })
    .on("request", displayResponseBody)
    .on("done", runCallBack);
};

const run = (folders: string | string[], flags: flagsTypes): void => {
  const shouldRunCollections = !flags.routes && !flags.environment;
  displayAvailableRoutes(collection, flags);
  displayAvailableEnvironmentVariable(defaultEnvironment, flags);

  if (shouldRunCollections) {
    runCollections(flags, folders);
  }
};
const possibleFlags = {
  vars: {
    type: stringTag
  },
  dev: {
    type: booleanTag,
    default: false
  },
  staging: {
    type: booleanTag,
    default: false
  },
  routes: {
    type: booleanTag,
    default: false
  },
  environment: {
    type: booleanTag,
    default: false
  },
  ciEnvironment: {
    type: booleanTag,
    default: false
  },
  updateLocalEnvironment: {
    type: booleanTag,
    default: true
  },
  reporter: {
    type: stringTag
  },
  reporterPath: {
    type: stringTag
  }
};

const cli = meow(helpMessage, {
  flags: possibleFlags
});

export const collectionsRunner = () => {
  run(cli.input, cli.flags);
};
