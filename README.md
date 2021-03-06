# loopback3-boilerplate

The project is generated by [LoopBack](http://loopback.io).

loopback3-boilerplate provides the following features:

* Auth
* Rights and Roles
* A User Settings
* Logging/Statistics
* Templates
* Emails

## How to start

**Note** that this seed project requires node v4.x.x or higher and npm 2.14.7 but in order to be able to take advantage of the complete functionality we **strongly recommend node >=v6.5.0 and npm >=3.10.3.**

In order to start the seed use:

    $ git clone https://github.com/Uiseguys/loopback3-boilerplate.git
    $ cd loopback3-boilerplate
    # install the project's dependencies
    $ npm install
    # install strongloopback
    $ npm install -g strongloop
    # create basic tables
    $ npm run db autoupdate
    # insert seed data
    $ npm run db db-seed
    # start project
    $ npm start  

## Configuration

### database and mail configuration

copy **server/datasources.example.json** to **server/datasources.json**

    {
      "db": {
        "name": "db",
        "connector": "memory"
      },
      "mydb": {
        "name": "mydb",
        "connector": "postgresql",
        "host": "localhost",
        "port": 5432,
        "database": "i18next",
        "user": "postgres",
        "debug": true,
        "password": "root"
      },
      "myEmail": {
        "name": "myEmail",
        "connector": "mail",
        "transports": [
          {
            "type": "smtp",
            "host": "email.active24.com",
            "secure": false,
            "tls": {
              "rejectUnauthorized": false
            },
            "port": 587,
            "auth": {
              "user": "cesko@gastro-booking.com",
              "pass": "n6EEUd5xCJ"
            }
          }
        ]
      }
    }

### server ip and port

Edit **server/config.json**

    {
      "restApiRoot": "/api",
      "host": "127.0.0.1",
      "port": 3000,
      "remoting": {
        "context": false,
        "rest": {
          "handleErrors": false,
          "normalizeHttpPath": false,
          "xml": false
        },
        "json": {
          "strict": false,
          "limit": "100kb"
        },
        "urlencoded": {
          "extended": true,
          "limit": "100kb"
        },
        "cors": false
      }
    }

## How to update?

Edit models and run `$ npm run db autoupdate`

## Features

### Template

This feature is based on [carbone](https://github.com/Ideolys/carbone).

* Uploading template

      		url: api/Templates
      		method: GET

* Downloading template

      	    url: api/Templates/:templateId
      	    method: POST
      	    params:
      	    {
      		    data: {
      			    firstname: 'Test',
      			    lastname: 'Test',
      		    }
      		    options: {
      			    convertTo: 'pdf'
      			}
      		}

* Delete template

      		url: api/Templates/:templateId
      		method: DELETE

### Emails

You must configure email server on server/datasources.json first.

    "myEmail": {
        "name": "myEmail",
        "connector": "mail",
        "transports": [
          {
            "type": "smtp",
            "host": "email.active24.com",
            "secure": false,
            "tls": {
              "rejectUnauthorized": false
            },
            "port": 587,
            "auth": {
              "user": "cesko@gastro-booking.com",
              "pass": "n6EEUd5xCJ"
            }
          }
        ]
      }

* Uploading template

      		url: api/email
      		method: POST

* sending email

      	    url: api/email/send
      	    method: POST
      	    params:
      	    {
      	      	    to: 'toaddress@example.com',
      	      	    subject: 'subject',
      	      	    template: 'templatefilename'
      		    data: {
      			    firstname: 'Test',
      			    lastname: 'Test',
      		    }
      		}
