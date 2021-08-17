import {
  insertUtilities,
  queryUtilities,
  projectUtilities,
  updateUtilities,
  processHook,
  dbHelpers,
  resolverHelpers
} from "mongo-graphql-starter";
// import starter from "mongo-graphql-starter";
import hooksObj from "../hooks.js";
const runHook = processHook.bind(this, hooksObj, "Employee");
const { decontructGraphqlQuery, cleanUpResults, dataLoaderId } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import EmployeeMetadata from "./Employee.js";

async function loadEmployees(db, aggregationPipeline, root, args, context, ast) {
  await processHook(hooksObj, "Employee", "queryPreAggregate", aggregationPipeline, { db, root, args, context, ast });
  let Employees = await dbHelpers.runQuery(db, "employees", aggregationPipeline);
  await processHook(hooksObj, "Employee", "adjustResults", Employees);
  Employees.forEach(o => {
    if (o._id) {
      o._id = "" + o._id;
    }
  });
  return cleanUpResults(Employees, EmployeeMetadata);
}

export const Employee = {};

export default {
  Query: {
    async getEmployee(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, EmployeeMetadata, "Employee");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadEmployees(db, aggregationPipeline, root, args, context, ast, "Employee");

      return {
        Employee: results[0] || null
      };
    },
    async allEmployees(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, EmployeeMetadata, "Employees");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.Employees = await loadEmployees(db, aggregationPipeline, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let $match = aggregationPipeline.find(item => item.$match);
          let countResults = await dbHelpers.runQuery(db, "employees", [
            $match,
            { $group: { _id: null, count: { $sum: 1 } } }
          ]);
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {
    async createEmployee(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(
        gqlPacket,
        "Employee",
        EmployeeMetadata,
        { create: true }
      );
      return await resolverHelpers.runMutation(session, transaction, async () => {
        let newObject = await newObjectFromArgs(args.Employee, EmployeeMetadata, { ...gqlPacket, db, session });
        let requestMap = parseRequestedFields(ast, "Employee");
        let $project = requestMap.size ? getMongoProjection(requestMap, EmployeeMetadata, args) : null;

        newObject = await dbHelpers.processInsertion(db, newObject, {
          ...gqlPacket,
          typeMetadata: EmployeeMetadata,
          session
        });
        if (newObject == null) {
          return { Employee: null, success: false };
        }
        await setUpOneToManyRelationships(newObject, args.Employee, EmployeeMetadata, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project
          ? (
              await loadEmployees(
                db,
                [{ $match: { _id: newObject._id } }, { $project }, { $limit: 1 }],
                root,
                args,
                context,
                ast
              )
            )[0]
          : null;
        return resolverHelpers.mutationSuccessResult({ Employee: result, transaction, elapsedTime: 0 });
      });
    },
    async updateEmployee(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(
        gqlPacket,
        "Employee",
        EmployeeMetadata,
        { update: true }
      );
      return await resolverHelpers.runMutation(session, transaction, async () => {
        let { $match, $project } = decontructGraphqlQuery(
          args._id ? { _id: args._id } : {},
          ast,
          EmployeeMetadata,
          "Employee"
        );
        let updates = await getUpdateObject(args.Updates || {}, EmployeeMetadata, { ...gqlPacket, db, session });

        if ((await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session })) === false) {
          return resolverHelpers.mutationCancelled({ transaction });
        }
        if (!$match._id) {
          throw "No _id sent, or inserted in middleware";
        }
        await setUpOneToManyRelationshipsForUpdate([args._id], args, EmployeeMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "employees", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project
          ? (await loadEmployees(db, [{ $match }, { $project }, { $limit: 1 }], root, args, context, ast))[0]
          : null;
        return resolverHelpers.mutationSuccessResult({ Employee: result, transaction, elapsedTime: 0 });
      });
    },
    async updateEmployees(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(
        gqlPacket,
        "Employee",
        EmployeeMetadata,
        { update: true }
      );
      return await resolverHelpers.runMutation(session, transaction, async () => {
        let { $match, $project } = decontructGraphqlQuery({ _id_in: args._ids }, ast, EmployeeMetadata, "Employees");
        let updates = await getUpdateObject(args.Updates || {}, EmployeeMetadata, { ...gqlPacket, db, session });

        if ((await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session })) === false) {
          return resolverHelpers.mutationCancelled({ transaction });
        }
        await setUpOneToManyRelationshipsForUpdate(args._ids, args, EmployeeMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "employees", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project ? await loadEmployees(db, [{ $match }, { $project }], root, args, context, ast) : null;
        return resolverHelpers.mutationSuccessResult({ Employees: result, transaction, elapsedTime: 0 });
      });
    },
    async updateEmployeesBulk(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(
        gqlPacket,
        "Employee",
        EmployeeMetadata,
        { update: true }
      );
      return await resolverHelpers.runMutation(session, transaction, async () => {
        let { $match } = decontructGraphqlQuery(args.Match, ast, EmployeeMetadata);
        let updates = await getUpdateObject(args.Updates || {}, EmployeeMetadata, { ...gqlPacket, db, session });

        if ((await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session })) === false) {
          return resolverHelpers.mutationCancelled({ transaction });
        }
        await dbHelpers.runUpdate(db, "employees", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });

        return await resolverHelpers.finishSuccessfulMutation(session, transaction);
      });
    },
    async deleteEmployee(root, args, context, ast) {
      if (!args._id) {
        throw "No _id sent";
      }
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(
        gqlPacket,
        "Employee",
        EmployeeMetadata,
        { delete: true }
      );
      try {
        let $match = { _id: ObjectId(args._id) };

        if ((await runHook("beforeDelete", $match, { ...gqlPacket, db, session })) === false) {
          return { success: false };
        }
        await dbHelpers.runDelete(db, "employees", $match);
        await runHook("afterDelete", $match, { ...gqlPacket, db, session });
        return await resolverHelpers.finishSuccessfulMutation(session, transaction);
      } catch (err) {
        await resolverHelpers.mutationError(err, session, transaction);
        return { success: false };
      } finally {
        resolverHelpers.mutationOver(session);
      }
    }
  }
};
