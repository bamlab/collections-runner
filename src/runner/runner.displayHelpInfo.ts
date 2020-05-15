// @ts-ignore
import * as logTree from "console-log-tree";
import {
  VariableScope,
  CollectionDefinition,
  ItemGroupDefinition
} from "postman-collection";
import { flagsTypes, logTreeInput } from "./runner.runCollections.types";

const parseChildren = (folders: (ItemGroupDefinition)[]): logTreeInput[] => {
  // @ts-ignore
  return folders.map(folder => {
    return {
      name: folder.name,
      children: folder.item && parseChildren(folder.item)
    };
  });
};
const parseCollection = (
  collection: CollectionDefinition
): { name: string; children: undefined | logTreeInput[] } => {
  return {
    // @ts-ignore
    name: collection.info.name,
    children: collection.item && parseChildren(collection.item)
  };
};

const displayAvailableRoutesWhenAskedTo = (
  collection: CollectionDefinition
): void => {
  const collectionTree = logTree.parse(parseCollection(collection));
  // eslint-disable-next-line no-console
  console.log(collectionTree);
};

export const displayAvailableRoutes = (
  collection: CollectionDefinition,
  flags: flagsTypes
): void => {
  if (flags.routes) {
    displayAvailableRoutesWhenAskedTo(collection);
  }
};

const parseEnvironment = (
  environment: VariableScope
): { name: string; children: { name: string }[] }[] => {
  // @ts-ignore
  return environment.values.map(variable => ({
    name: variable.key,
    children: [{ name: variable.value }]
  }));
};
const displayAvailableEnvironmentVariableWhenAskedTo = (
  environment: VariableScope
): void => {
  const environmentTree = logTree.parse(parseEnvironment(environment));
  // eslint-disable-next-line no-console
  console.log(environmentTree);
};

export const displayAvailableEnvironmentVariable = (
  environment: VariableScope,
  flags: flagsTypes
) => {
  if (flags.environment) {
    displayAvailableEnvironmentVariableWhenAskedTo(environment);
  }
};

export const helpMessage = `
Usage
  $ tsc ./runCollections.ts && ./runCollections.js <folders> --vars=<variables>

Arguments:
  folders: A space-separated list of folders tu run, in given order.
  Example: ./runCollections.js Registration VLS_Booking

Options:
  --vars A comma-separated list of variables in name:value format
    Example: ./runCollections.js Register --vars=email:toto@gmail.com,password:pass
    Warning: commas and colons are not supported in vars for the moment. Make a PR if you need one.
  --dev A boolean specifying if collections should be ran on dev API
    Example: ./runCollections.js Register --dev
    Warning: by default collections are ran on local environment file config
  --staging A boolean specifying if collections should be ran on staging API
    Example: ./runCollections.js Register --staging
    Warning: by default collections are ran on local environment file config
  --routes A boolean specifying if collections list should be displayed on the console
    Example: ./runCollections.js Register --routes
  --environment A boolean specifying if possible environment variable list should be displayed on the console
    Example: ./runCollections.js Register --environment
  --ciEnvironment A boolean specifying if default ci environment should be loaded
    Example: ./runCollections.js Register --ciEnvironment
    Warning: by default postman_environment.local.json is used
  --updateLocalEnvironment A boolean specifying if local environment variables should be overridden after running collections 
    Example: ./runCollections.js Register --updateLocalEnvironment
    Warning: by default postman_environment.local.json is overridden by the new environement variables
  --reporter A string specifying an additional reporter (if not specified, only reporter will be "cli")
    Example: ./runCollections.js Register --reporter=html
    Warning: To make it work, you will need to add the specified reporter npm package dependency to your project
  --reporterPath A string specifying your additional reporter export path (only work if reporter flag specified)
    Example: ./runCollections.js Register --reporter=html --reporterPath='./newman/output/report.html'
`;
