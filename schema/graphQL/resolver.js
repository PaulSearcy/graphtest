import GraphQLJSON from "graphql-type-json";

import Employee, { Employee as EmployeeRest } from "./Employee/resolver.js";

const { Query: EmployeeQuery, Mutation: EmployeeMutation } = Employee;

export default {
  JSON: GraphQLJSON,
  Query: Object.assign({}, EmployeeQuery),
  Mutation: Object.assign({}, EmployeeMutation),
  Employee: { ...EmployeeRest }
};
