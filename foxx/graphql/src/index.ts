import { schema } from "./schema";
import createGraphqlRouter from "@arangodb/foxx/graphql";
import { graphql } from "graphql";

// This is a regular Foxx router.
const router = createGraphqlRouter({ schema, graphiql: true, graphql });

module.context.use(router);
