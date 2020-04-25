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

  newman
    .run(
      {
        collection,
        environment,
        reporters: "cli",
        folder: folders,
        bail: true
      },
      () => {
        flags.updateLocalEnvironment && saveEnvironmentVariables(environment);
      }
    )
    .on("request", displayResponseBody);
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
  }
};

const cli = meow(helpMessage, {
  flags: possibleFlags
});

export const collectionsRunner = () => {
  run(cli.input, cli.flags);
};
