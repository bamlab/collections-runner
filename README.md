# collections-runner

CLI to run postman collections interactively.
Can be used to test APIs.
Can be used to develop APIs or applications using APIs.
Is based on newman from Postman.
![](DEMO.gif)

## Features

- Run postman collections with custom environment variables in a unique command line
- Display all available routes and collections
- Quickly set default development or staging environment variables
- Multi-select routes to run
- Enable CI environment to be integrated to CI tests
- Select environment variables to update among the ones used in the selected routes
- Store environment variables in a local file to be used on next run

## Install

```
yarn add collections-runner
```

Create a `postman` folder at the root of your project.

This folder contains :

- Add a `postman_collection.json` containing your postman collections
- Add a `postman_environment.json` containing your postman environment
- Add a `postman_environment.local.json` containing your local postman environment, this file should be gitignored as it is updating after each run
- Add a `default.dev.json` containing default environment variables for your dev environment (typically your local url)
- Add a `default.staging.json` containing default environment variables for your staging environment (typically your staging url)

## Usage

```
yarn collections-runner [routes names] [collections flags or vars]
```

Runs postman collections.

```
yarn collections-automator
```

Is used to interactively construct collections-runner commands.
