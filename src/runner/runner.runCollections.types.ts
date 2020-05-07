export type flagsTypes = {
  vars: string;
  dev: boolean;
  staging: boolean;
  routes: boolean;
  environment: boolean;
  ciEnvironment: boolean;
  updateLocalEnvironment: boolean;
};

export type logTreeInput = { name: string; children?: logTreeInput[] };
