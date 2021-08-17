import { createGraphqlSchema } from "mongo-graphql-starter";
import * as Employee from "./scaffoldSchema";

import path from "path";

createGraphqlSchema(Employee, path.resolve("./schema"));