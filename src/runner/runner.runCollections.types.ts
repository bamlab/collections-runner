export type flagsTypes = {
  vars: string;
  dev: boolean;
  staging: boolean;
  routes: boolean;
  environment: boolean;
  ciEnvironment: boolean;
  updateLocalEnvironment: boolean;
  reporter: string;
  reporterOptions: string;
  collectionUrl: string;
  environmentUrl: string;
};

export type logTreeInput = { name: string; children?: logTreeInput[] };
