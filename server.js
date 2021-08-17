// import { graphql, buildSchema } from "graphql";
// import mysql from "mysql2/promise";
import { MongoClient } from 'mongodb';
import resolvers from "./schema/graphQL/resolver.js";
import schema from "./schema/graphQL/schema.js";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "graphql-tools";
import express from "express";

// const main = async () => {

    // const mongoClient = new MongoClient(`mongodb://127.0.0.1:27017`);
    // await mongoClient.connect();
    // const mongoDB = mongoClient.db('test');
    // const collection = mongoDB.collection('listings');
    // const findResult = await collection.find({}).toArray();


    // const db = await mysql.createConnection({
    //     host     : '127.0.0.1',
    //     port: 3306,
    //     database : 'employees',
    //     user     : 'root',
    //     password : 'paul'
    // })

    // const getEmployee = async () => db.query(`SELECT * FROM employees LIMIT 50`);

    // let test =  await getEmployee();

    // var schema = buildSchema(`
    //     type Employee {
    //         emp_no: ID!,
    //         birth_date: Int,
    //         first_name: String,
    //         last_name: String,
    //         gender: String,
    //         hire_date: Int,
    //     }
    // `);

    // // The root provides a resolver function for each API endpoint
    // var root = {
    // hello: () => {
    //     return 'Hello world!';
    // },
    // };

    // // Run the GraphQL query '{ hello }' and print out the response
    // graphql(schema, '{ hello }', root).then((response) => {
    // console.log(response);
    // });
    const app = express();
    const mongoClientPromise = MongoClient.connect(`mongodb://127.0.0.1:27017`, { useNewUrlParser: true });
    const mongoDbPromise = mongoClientPromise.then(client => client.db('test'));
    
    const root = { client: mongoClientPromise, db: mongoDbPromise };
    const executableSchema = makeExecutableSchema({ typeDefs: schema, resolvers });

    app.use(
        "/graphql",
        graphqlHTTP({
            schema: executableSchema,
            graphiql: true,
            rootValue: root
        })
    );
    app.listen(3002);
// }

// main();