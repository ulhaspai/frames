## App
This is the client UI application for the _frames_ application. 

### Requirements 
Requirements to run this project are as follows:
* Auth0 account with a configured Regular Web application
* A configured client running locally to access the backend

### Running the application 

#### Auth0 config
Before running the application you will need to configure the application for Auth0. 
Update the [serverless.yml](./serverless.yml) file with the appropriate value for JWKS_URL

```yaml
provider:
  environment:
    JWKS_URL: https://<tenant-name>.auth0.com/.well-known/jwks.json
```

#### NPM packages
Run the following command to install all the required npm packages

```shell script
npm install
```

#### Deploy to AWS
Run the following command to deploy the application to AWS as a serverless application

```shell script
# install serverless framework if its not already installed
npm install serverless -g

# deploy the application to AWS
sls deploy -v
```
