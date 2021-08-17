import { graphql, buildSchema } from "graphql";
import mysql from "mysql2/promise";
import { MongoClient } from 'mongodb';

const main = async () => {

    const mongoClient = new MongoClient(`mongodb://127.0.0.1:27017`);
    await mongoClient.connect();
    const mongoDB = mongoClient.db('test');
    const collection = mongoDB.collection('listings');
    const findResult = await collection.find({}).toArray();
    debugger;

    const db = await mysql.createConnection({
        host     : '127.0.0.1',
        port: 3306,
        database : 'employees',
        user     : 'root',
        password : 'paul'
    })

    const getEmployee = async () => db.query(`SELECT * FROM employees LIMIT 50`);

    let test =  await getEmployee();

    debugger
    var schema = buildSchema(`
        type Employee {
            emp_no: ID!,
            birth_date: Int,
            first_name: String,
            last_name: String,
            gender: String,
            hire_date: Int,
        }
    `);

    // The root provides a resolver function for each API endpoint
    var root = {
    hello: () => {
        return 'Hello world!';
    },
    };

    // Run the GraphQL query '{ hello }' and print out the response
    graphql(schema, '{ hello }', root).then((response) => {
    console.log(response);
    });
}

main();