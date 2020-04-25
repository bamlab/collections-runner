import * as inquirer from "inquirer";
import {
  noHelpWanted,
  getEnvironmentVariablesDetails,
  defaultchoices
} from "./automator.questions";
import { logCommandToUse } from "./automator.answers";

export const runInquirer = async () => {
  try {
    const helpQuestion = {
      type: "list",
      name: "help",
      message: "Which help do you want to display",
      choices: [
        "Use the tool",
        "Show the available routes",
        "Show the variables"
      ],
      default: "Use the tool"
    };

    const environmentQuestion = {
      type: "list",
      name: "environment",
      message: "Which environement would you like to use",
      choices: ["development", "staging"],
      when: noHelpWanted
    };

    const routeQuestion = {
      type: "checkbox",
      name: "routes",
      message: "Which routes would you like to run",
      choices: defaultchoices,
      when: noHelpWanted
    };
    const variablesQuestion = {
      type: "checkbox",
      name: "devVariables",
      message: "Which environment variables would you like to update",
      choices: getEnvironmentVariablesDetails,
      when: noHelpWanted
    };

    const useLocalEnvironmentQuestion = {
      type: "confirm",
      name: "useLocalEnvironment",
      message: "Whould you like to use your local environement file",
      default: true,
      when: noHelpWanted
    };

    const updateEnvironmentQuestion = {
      type: "confirm",
      name: "updateEnvironment",
      message:
        "Whould you like to update your local environment while running the collections",
      default: true,
      when: noHelpWanted
    };

    const answers = await inquirer.prompt([
      helpQuestion,
      environmentQuestion,
      routeQuestion,
      useLocalEnvironmentQuestion,
      variablesQuestion,
      updateEnvironmentQuestion
    ]);
    logCommandToUse(answers);
  } catch {
    // eslint-disable-next-line no-console
    // @ts-ignore
    error => console.log("error", error);
  }
};
