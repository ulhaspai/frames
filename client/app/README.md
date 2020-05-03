## App
This is the client UI application for the _frames_ application. 

### Requirements 
Requirements to run this project are as follows:
* Auth0 account with a SPA configured application
* A serverless backend running on AWS 

### Running the application

#### Auth0 config
Before running the application you will need to configure the application for Auth0. Provide the configuration
to the [login.config.ts](src/app/login/login.config.ts) file through a gitignored file by the name _temp.auth0.config.ts_ 
in the same folder. Create a file with that name and add the following to that file.

```typescript
export const localAuth0Config = {
  domain: "AUTH0_APP_DOMAIN_NAME",
  client_id: "AUTH0_APP_CLIENT_ID"
}
```


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

