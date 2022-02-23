import { makeExecutableSchema } from "@graphql-tools/schema";

const sdlSchema = `
  type Author {
    firstName: String
  }
  type Query {
    author(id: Int!): Author
  }`;

export const schema = makeExecutableSchema({
  typeDefs: sdlSchema,
});
