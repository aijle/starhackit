Node.js Starter Kit
==================

Backend Starter Kit written in Node.js with the following features:

* **ES6/ES7** ready: async/await, classes, arrow function, template strings etc ...
* REST API designed with [RAML](http://raml.org/), produce a human friendly [API documentation](http://starhack.it/api/v1/doc/api.html) and a **Mock Server** for frontend developer.
* [Json Web Token](https://jwt.io/) authentication.
* **Social Authentication** with Facebook, Google, etc .. Powered by [passport](http://passportjs.org/)
* Fined-grained **Authorization** based on users, groups and resources.
* Scalable by using a **Micro Services** based architecture. Orchestrating with [pm2](http://pm2.keymetrics.io/)
* **SQL** Relational database support with  [Sequelize](http://docs.sequelizejs.com/en/latest/)
* **Logging** with timestamp and filename.

# Workflow with npm scripts

These are the main *npm* commands during a standard developer workflow:

| npm command    | details  |
|----------------|----------|
| `npm install`  | Install dependencies  |
| `npm run devlabinstall`  | Install services such as Rabbitmq and Postgresql though docker |
| `npm start`    | Start the backend  |
| `npm test`     |  Run the tests and generate a code coverage |
| `npm run mocha`|  Run the tests |
| `npm run mock`  |  Run a mock server based on the RAML api definition |
| `npm run doc` |  Generate the API HTML documentation |

# Dependencies

## Database

This project can use the most popular SQL databases such as PostgreSQL, MySQL, Oracle, MSSQL and Sqlite. This is achieved with [Sequelize](http://docs.sequelizejs.com/en/latest/), the most popular [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) for Node.js


For rapid prototyping, the easiest database to configure is sqlite. In production, StarHackIt is using PostgreSQL.

### Sqlite configuration

```
"db":{
  "driver": "sqlite3",
  "dialect":"sqlite",
  "database": "dev",
  "user": "user",
  "logging": true,
  "storage": "./db.dev.sqlite"
}

```
### Postgresql configuration

Here is an example of the configuration for Postgres:

```
"db":{
  "driver": "pg",
  "dialect":"postgres",
  "database": "dev",
  "user": "user",
  "password": "password",
  "host": "localhost",
  "port": "5432",
  "logging": true,
  "pool": {
    "maxConnections": 100,
    "maxIdleTime": 60
  }
}
```

## Message Queue

A use case for using a RabbitMq in this project is to send an email during registration. It decouples the act of requesting an action and executing it. That solves a bunch of issues,  for instance, when the mail server is not reachable or down, the [job](src/plugins/users/jobs/mail/MailJob.js) who is processing the email expedition can retry until the mail service is restored.

Example of configuration:

```
"rabbitmq":{
  "url":"amqp://192.168.99.100"
}
```

## Sending Email
Sending email is a very common task for an application. For instance, an email is sent during registration, when a user requests a new password etc ...

The project is leveraging [nodemailer](http://nodemailer.com/) which makes sending e-mail easy as cake:

```
"mail": {
  "from": "StarHackIt <notification@yourproject.com>",
  "signature": "The Team",
  "smtp": {
    "service": "Mailgun",
    "auth": {
      "user": "postmaster@yourproject.mailgun.org",
      "pass": "2109aef076a992169436141d0aba0450"
    }
  }
}
```

Please have a look at the [nodemailer documentation](https://github.com/nodemailer/nodemailer) for more information about how to use another mail provider.

## Social authentication

Beside creating an account with username and password, this starter kit supports social authentication such as Facebook, Google, Twitter etc ...

[passportjs](http://passportjs.org/) has more than 300 different strategies to choose from.

Example of configuration for the Facebook authentication:

```
"authentication":{
  "facebook":{
    "clientID":"",
    "clientSecret":"",
    "callbackURL": "http://localhost:3000/v1/auth/facebook/callback"
  }
}
```

## Redis session store

*Redis* can be used to quickly store and retrieve session data. This allows for zero down time in production when the api server is restarted.

Here is how to configure Redis:

```
"redis":{
  "url": "redis://localhost:6379"
},
```

## Docker containers

### For develpment
To install the docker containers for the various services such as RabbitMq and Postgres on the local machine, the [DevLab](https://github.com/TechnologyAdvice/DevLab) project is being used to containerize the development workflow, see its configuration file: [devlab.yml](server/devlab.yml)

    # cd server
    # npm run devlabinstall

To check that the containers are running:

```
# docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                         NAMES
ccd9f559fabd        rabbitmq:latest     "/docker-entrypoint.s"   36 minutes ago      Up 36 minutes       4369/tcp, 25672/tcp, 0.0.0.0:5672->5672/tcp   devlab_rabbitmq_frederic_1446641005596
```

### For production

To build a production dockerized system, please use `docker-compose` to build, start and stop containers:

    # docker-compose build
    # docker-compose up

## Start 

Before running the backend, check and modify the configuration located at [server/config/default.json](server/config/default.json).
Don't forget to correctly set the *rabbitmq* server location.

To start the backend:

    # cd server
    # npm start

## Test & Code Coverage
To test the backend:

    # npm test

It will not only test the code, but also checks the source code with eslint and generates a code coverage report located at `coverage/lcov-report/index.html`

# API - RAML

The REST API implemented by this backend is designed and modeled with [RAML](http://raml.org/) which stands for Rest API Modeling Language.
From a file describing the API such as the [user's API](src/plugins/users/raml/users.raml), several dedicated tools will perform the following benefits:

* `npm run doc`: The [API documentation in HTML](http://starhack.it/api.html)
* `npm run mock`: A mock server that will responds to web browser according the API specification, useful for frontend developers which can start before the backend is fully implemented.
* A mock client which verifies that the backend implemented correctly the API.

## REST API HTML documentation

The REST API HTML documentation is generated with the following command:

    # npm run doc

The result can be found at `build/api.html`

Behind the scene `npm run doc` invokes:

    # raml2html -i src/plugins/users/raml/users.raml -o build/api.html

To open the documentation, simply run

    # npm run opendoc

## Mock server

Given the RAML describing of an API, [raml-mocker-server](https://github.com/dmitrisweb/raml-mocker-server) will start responding the web client with data that comply with the API.

To start the mock server, run this npm script:

    # npm run mock

This script launches [mock-server.js](scripts/mock-server.js), modify it to eventually change the http port and the `raml` files to select.

# Development

[sequelize-cli](https://github.com/sequelize/cli) helps to manage the database migration and rollback.

## Creating a new data model

By using the *model:create* command, a new sequelize model is created alongside its migration script for database update and rollback

    $ ./node_modules/.bin/sequelize model:create --name User --attributes "name:text, password:text"

    $ ./node_modules/.bin/sequelize model:create --name UserPending --attributes "username:string(64), email:string(64), password:string, code:string(16)"

    $ ./node_modules/.bin/sequelize model:create --name PasswordReset --attributes "user_id:integer, token:string(32)"

2 files will be generated:
  * the javascript sequelize model in the *models* directory
  * the sql migration script in the *migrations* directory

Eventually change the sql table name to *underscore_case*

## Database migration

> Database migration are **not** necessary for development environment but only for system already in production.

Run the following command to migrate the database:

    $ ./node_modules/.bin/sequelize db:migrate

### Database rollback
When the new database update breaks in production, it's very handy to rollback as quick as possible:

    $ ./node_modules/.bin/sequelize db:migrate:undo
