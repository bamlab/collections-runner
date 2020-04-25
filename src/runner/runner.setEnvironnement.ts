// @ts-ignore
import * as fs from "fs";
import { flagsTypes } from "./runner.runCollections.types";
import { VariableScope } from "postman-collection";

const getDefaultVariables = (flags: flagsTypes): VariableScope => {
  // eslint-disable-next-line global-require
  const defaultEnvironment = require("../../../../postman/postman_environment.json");
  let defaultEnv = defaultEnvironment;
  if (flags && !flags.ciEnvironment) {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      defaultEnv = require("../../../../postman/postman_environment.local.json");
    } catch (error) {
      console.log(
        `PLEASE_CREATE_NEW_JSON_FILE at postman/postman_environment.local.json you can copy postman/postman_environment.json`
      );
      console.log(`USING postman/postman_environment.json`);
      // eslint-disable-next-line global-require, import/no-dynamic-require
      defaultEnv = require("../../../../postman/postman_environment.json");
    }
  }
  return new VariableScope(defaultEnv);
};

const setCustomVariables = (
  environment: VariableScope,
  variables: string[]
): void => {
  for (let i = 0; i < variables.length; i += 1) {
    const touple = variables[i].split(":");

    if (touple.length < 2) {
      throw new Error(`Malformed variable: ${variables[i]}`);
    }
    environment.set(touple[0], touple[1], "string");
  }
};

export const setEnvironmentVariables = (flags: flagsTypes): VariableScope => {
  const environment = getDefaultVariables(flags);
  if (flags && flags.dev) {
    const defaultEnv = require("../../../../postman/default.dev.json");
    for (let [key, value] of Object.entries(defaultEnv)) {
      environment.set(key, value, "string");
    }
  }
  if (flags && flags.staging) {
    const defaultEnv = require("../../../../postman/default.staging.json");
    for (let [key, value] of Object.entries(defaultEnv)) {
      environment.set(key, value, "string");
    }
  }
  if (flags && flags.vars) {
    const variables: string[] = flags.vars.split(",");
    setCustomVariables(environment, variables);
  }
  return environment;
};

export const saveEnvironmentVariables = (environment: VariableScope): void => {
  const formattedEnvironnement = JSON.stringify(environment.toJSON(), null, 2);
  fs.writeFileSync(
    "./postman/postman_environment.local.json",
    formattedEnvironnement
  );
};
