// @ts-ignore
import { spawn } from "child_process";

// @ts-ignore
const copyToClipBoard = data => {
  const proc = spawn("pbcopy");
  // @ts-ignore
  proc.stdin.write(data);
  // @ts-ignore
  proc.stdin.end();
};

export const logCommandToUse = (answers: any) => {
  const commandeToUse = computeCommandToUse(answers);
  copyToClipBoard(commandeToUse);
  // eslint-disable-next-line no-console
  console.log("command has been copy to clipboard", commandeToUse);
};

const computeCommandToUse = (answers: any): string => {
  if (answers.help !== "Use the tool") {
    return logHelpCommands(answers.help);
  }
  return computeCommandToUseWithoutHelp(answers);
};
const updateCustomCommand = (
  customCommand: string,
  newCommand: string
): string => {
  return customCommand.concat(newCommand);
};

const computeCommandToUseWithoutHelp = (answers: any): string => {
  let customCommand = "yarn collections-runner";
  if (answers.routes.length) {
    // @ts-ignore
    answers.routes.forEach(route => {
      customCommand = updateCustomCommand(customCommand, ` "${route}"`);
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
    customCommand = updateCustomCommand(
      customCommand,
      " --updateLocalEnvironment=false"
    );
  }
  if (answers.devVariables.length) {
    customCommand = updateCustomCommand(customCommand, " --vars=");
    // @ts-ignore
    answers.devVariables.forEach(variable => {
      const variableInfo = variable.split(":");
      const variableName = variableInfo[0];
      customCommand = updateCustomCommand(
        customCommand,
        `${variableName}:VALUE,`
      );
    });
    customCommand = customCommand.slice(0, -1);
  }
  return customCommand;
};

const logHelpCommands = (
  helpCommand: "Show the available routes" | "Show the variables"
): string => {
  if (helpCommand === "Show the available routes") {
    return "yarn collections-runner --routes";
  }
  // eslint-disable-next-line no-console
  console.log("this feature is not implemented yet");
  return "yarn collections-runner --help";
};
