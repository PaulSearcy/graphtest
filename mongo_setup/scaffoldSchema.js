import { dataTypes, createGraphqlSchema } from "mongo-graphql-starter";
import path from 'path';

const {
    MongoIdType,
    MongoIdArrayType,
    StringType,
    StringArrayType,
    BoolType,
    IntType,
    IntArrayType,
    FloatType,
    FloatArrayType,
    DateType,
    arrayOf,
    objectOf,
    formattedDate,
    JSONType,
    typeLiteral
} = dataTypes;

export const Employee = {
    table: "employees",
    fields: {
      _id: MongoIdType,
      emp_no: IntType,
      birth_date: IntType,
      first_name: StringType,
      last_name: StringType,
      gender: StringType,
      hire_date: IntType,
    }
};