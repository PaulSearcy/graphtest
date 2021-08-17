import { GraphQLClient } from "graphql-request";
const endpoint = process.env.GRAPHQL_URL;
const token = process.env.AUTH_TOKEN;

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${token}`
  }
});
async function processQuery(query, name, fields, variables = {}) {
  return new Promise(async (resolve, reject) => {
    console.log(`doing ${name}`);
    const { data, errors, extensions, headers, status } = await graphQLClient.rawRequest(query);
    if (status === 200) {
      console.log(name + "passed");
      console.table(data);
      resolve(name);
    } else {
      console.error(JSON.stringify({ fields, name, errors, extensions, headers, status }));
      reject(errors);
    }
  });
}
const runQueries = async () => {
  await processQuery(
    `{allEmployees(LIMIT:1){Employees{_id emp_no birth_date first_name last_name gender hire_date}}}`,
    "Employee",
    "_id emp_no birth_date first_name last_name gender hire_date"
  ).catch(error => console.error(error));

  // await processQuery(`mutation:{Employee("_id emp_no birth_date first_name last_name gender hire_date")}`," mutation Employee", "")
  // .catch((error) => console.error(error))
};
runQueries().catch(error => console.error(error));
