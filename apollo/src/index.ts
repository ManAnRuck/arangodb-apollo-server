
import { ApolloServer } from "apollo-server";
import { todoResolvers } from "./resolvers";
import { typeDefs } from "./schema";




(async () => {
    const server = new ApolloServer({ typeDefs, resolvers: [todoResolvers] });

  const { url } = await server.listen();

  console.log(`Server ready at ${url}`);
})();