## GraphQL + MongoDB express server (in Typescript)

This is just a starter example on how to build a GraphQL server with MongoDB database in Typescript. 

The advanage of this solution is a strong type checking, thanks to Typescript, and a easy GraphQL schema definition using GraphQLSchema and GraphQLObjectType.

The logic for the database models are inside the `src/db` folder while for the GraphQL types, query and mutation are inside the `src/schema` folder. 
The schema is then built in the `src/schema/index.ts` file.

For the authetication the method `setupPassportAuth` in the file `src/authetication.ts` will handle all the routes and access to the user table.  


### More details

* Using [Express](https://github.com/expressjs/express) and [GraphQL HTTP Server](https://github.com/graphql/express-graphql) to set up a graphql server.
* Using Passport and [Passport JSON Web Token](https://github.com/themikenicholson/passport-jwt) for user authentication with bcrypt for hashing the password during user creation.
* Using [Mongoose](https://github.com/Automattic/mongoose) to interact with MongoDB and take advantage of easy model definitions and support for Typescript. 
* Using [GraphQL.js](https://github.com/graphql/graphql-js) dynamically create a GraphQLSchema with types, query and mutation.
* Using [Typescript](https://github.com/Microsoft/TypeScript) type checking compilation for development and production.


### Install

The main Express App entry point is `src/server.ts`, it can be launch with the following commands:

For development (with live reload)
```sh
npm start
```
For production (app served from dist folder)

```sh
npm run build
```


### Usage

In this example we open a MongoDB connection on `mongodb://localhost:27017` and open the `heros` database, so we need to make sure `mongod` service is running and the default port is set to `27017` (or you can adjust the parameters in the src/server.ts file).

Run the express server (with npm start or npm build).

We need then to create a user to login with, we can create an admin user by visiting the debug url `http://localhost:3000/add-admin-user`.

We can then login from the auth form by visiting `http://localhost:3000/auth` (default username: `admin`, password: `admin`).

The login page will respond with an auth `token`, if you use a client we can save it and set it in the headers for the following requests, if you use a Browser you can use an extension ([like this for Chrome](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj)) to set the `Authorization` header with the `token` (the token need to be preceded by `JWT` like `JWT eyJhbGcixxxxxxxxx`.

Now you are ready to open the GraphQL inspector by visiting `http://localhost:3000/graphql` and browse the schema and do query, mutation, etc.


License
----

MIT

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [GraphQL HTTP Server]: <https://github.com/graphql/express-graphql>
   [Typecript]: <http://typscriptlang.org>
