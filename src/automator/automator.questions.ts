import { Separator } from "inquirer";
import { VariableScope } from "postman-collection";
import { filterDoubleElementsFromList } from "../libs/filterDoubleElementsFromList";
import { getCollectionDetails } from "./automator.collections.services";

const usedCollection = require("../../../../postman/postman_collection.json");
const {
  parentsRoutesNames,
  childrenRoutesNames,
  usedVariables
} = getCollectionDetails(usedCollection);

const getEnvironmentDetails = (
  choosenEnvironment: "local" | "ci"
): VariableScope => {
  if (choosenEnvironment === "ci") {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require("../../../../postman/postman_environment.json");
  }
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require("../../../../postman/postman_environment.local.json");
  } catch (error) {
    console.log(
      `PLEASE_CREATE_NEW_JSON_FILE at postman/postman_environment.local.json you can copy postman/postman_environment.json`
    );
    console.log(`USING postman/postman_environment.json`);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require("../../../../postman/postman_environment.json");
  }
};

export const getEnvironmentVariablesDetails = (answers: any): string[] => {
  const wantedEnvironment = answers.useLocalEnvironment ? "local" : "ci";
  const environment = getEnvironmentDetails(wantedEnvironment);

  // @ts-ignore
  let usedVariablesInSelectedRoutes = [];

  Object.keys(usedVariables)
    .filter(key => answers.routes.includes(key))
    // @ts-ignore
    .forEach(key =>
      // @ts-ignore
      usedVariablesInSelectedRoutes.push(...usedVariables[key])
    );

  usedVariablesInSelectedRoutes = filterDoubleElementsFromList(
    // @ts-ignore
    usedVariablesInSelectedRoutes,
    // @ts-ignore
    (stringA, stringB) => stringA === stringB
  );

  const notAvailable = "notAvailable";
  // @ts-ignore
  const availablevariables = environment.values.map(variable => {
    // @ts-ignore
    if (usedVariablesInSelectedRoutes.includes(variable.key)) {
      return `${variable.key}: ${variable.value}`;
    }
    return notAvailable;
  });

  return availablevariables.filter(variable => variable !== notAvailable);
};

export const noHelpWanted = (answers: any): boolean => {
  return answers.help === "none";
};

export const defaultchoices = [
  new Separator("---------- Macro routes ----------"),
  ...parentsRoutesNames,
  new Separator("---------- All available routes ----------"),
  ...childrenRoutesNames
];
