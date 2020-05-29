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
    if (flags.collectionUrl) console.log('Sorry at this moment --collectionUrl is not compatible with --routes, showing availables routes in postman/postman_collection.json file \n')
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
    if (flags.environmentUrl) console.log('Sorry at this moment --environmentUrl is not compatible with --environment, showing environment variables in postman/postman_environment.json file. \n')
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
    Warning: Not compatible with: --collectionUrl
  --environment A boolean specifying if possible environment variable list should be displayed on the console
    Warning: Not compatible with: --environmentUrl
    Example: ./runCollections.js Register --environment
  --ciEnvironment A boolean specifying if default ci environment should be loaded
    Example: ./runCollections.js Register --ciEnvironment
    Warning: by default postman_environment.local.json is used
  --updateLocalEnvironment A boolean specifying if local environment variables should be overridden after running collections 
    Example: ./runCollections.js Register --updateLocalEnvironment
    Warning: by default postman_environment.local.json is overridden by the new environement variables
    Warning: Not compatible with: --environmentUrl
  --reporter A string specifying an additional reporter (if not specified, only reporter will be "cli")
    Example: ./runCollections.js Register --reporter=html
    Warning: To make it work, you will need to add the specified reporter npm package dependency to your project
  --reporterOptions A string (JSON format) specifying your additional reporter options (only work if reporter flag specified)
    Example: ./runCollections.js Register --reporter=html --reporterOptions='{"export":"./newman/output/report.html", "template":"./newman/template.hbs"}'
  --collectionUrl A string specifying collection URL you want to run. If specified, apiKey flag must be specified as well. If not specified, it will search for a file at path '../../../../postman/postman_collection.json'
    Example: ./runCollections.js --collectionUrl='https://api.getpostman.com/collections/<uid>' --apiKey=<apikey>
  --environmentUrl A string specifying environment URL you want to run. If specified, apiKey flag must be specified as well. If not specified, it will search for a file at path '../../../../postman/postman_environment.json'
    Example: ./runCollections.js --collectionUrl='https://api.getpostman.com/collections/<uid>' --environmentUrl='https://api.getpostman.com/environments/<uid>' --apiKey=<apikey>
    Warning: Not compatible with: --updateLocalEnvironment
`;
