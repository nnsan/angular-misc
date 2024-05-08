# MicroFrontend

## Build from scratch

Run `ng new <workspace name> --create-application=false` to generate the workspace instead of a new project

Run `ng generate application <application name>` for example `ng generate application shell` to generate application inside the projects folder

Run `ng generate library <library name>` to generate the new library in the project folder

Run `ng g component --project shell dashboard` to generate a new component dashboard for shell project

Run `ng g service  --project shared core/identity` to generate a new IdentityService in shared/core/identity.service.ts

Run `ng g class  --project shared core/user.model` to generate a new IdentityService in shared/core/user.model.ts

Run `ng g module --project customer order` for module and run `ng g component --project customer order/home` create home component in order module

## Setup Environment for Angular application and Angular Library

Run `ng generate environments --project shared` to create environment

### Setting environment for Angular application

In `angular.json` file. It contains a fileReplacements section in the configuration for each build target. For example: `/projects/<Application>/architect/build/configurations/development/fileReplacements`

```json
{
  "fileReplacements": [
      {
        "replace": "projects/shell/src/environments/environment.ts",
        "with": "projects/shell/src/environments/environment.development.ts"
      }
  ]
}
```

This means that when you build your development configuration with `ng build --configuration development`, the `projects/shell/src/environments/environment.ts` file is replaced with the target-specific version of the file, `projects/shell/src/environments/environment.development.ts`


### Setting environment for Angular Library

In `angular.json` file, in section `/projects/<Library>/architect/build/configurations`

```json
{
  "configurations": {
      "production": {
        "tsConfig": "projects/shared/tsconfig.lib.prod.json"
      },
      "development": {
        "tsConfig": "projects/shared/tsconfig.lib.json"
      }
  }
}
```

Re-map imports to lookup locations relative to the baseUrl for the shared library and other applications that use that.

In the `projects/shared/tsconfig.lib.json`

```json
{
  "compilerOptions": {
      "paths": {
        "environments": [
          "projects/shared/src/environments/environment.development.ts"
        ]
      }
    }
}
```

Or, simplify replace the environment by target-environment in build option of `angular.json` file. In the shell configuration

```json
{
  "development": {
    "fileReplacements": [
      {
        "replace": "projects/shared/src/environments/environment.ts",
        "with": "projects/shared/src/environments/environment.development.ts"
      }
    ]
  }
}
```

## @angular-architects/module-federation

Run `yarn add @angular-architects/module-federation -D`

Run `ng add @angular-architects/module-federation --project shell --port 4200 --type dynamic-host`

Run `ng add @angular-architects/module-federation --project customer --port 4201 --type remote`

## Setup Angular Material

Run `yarn add @angular/material @angular/cdk @angular/animations`

Update following files to add font and style in the project: `app.module.ts`, `index.html`, `style.scss`, `angular.json`

Note `BrowserModule` and `BrowserAnimationsModule` only for bootstrap Module.

Add `CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA` in `ngModule.schemas` of bootstrap application

## Tools

Package management tool [yarn](https://yarnpkg.com/cli/install)
