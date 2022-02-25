import { aql } from "arangojs";
import { db } from "../../db";
import { todosCollection } from "../../db/collections/todo";
import { Resolvers, Todo } from "../../generated/graphql";

export const todoResolvers: Resolvers = {
  Query: {
    todos: async () => {
      let todos: Todo[] = [];
      const todosData = await db
        .query(
          aql`
            FOR t IN ${todosCollection}
            RETURN MERGE( { id: t._key } , t)
          `
        )
        .catch((err) => {
          throw new Error(err);
        });

      for await (const todo of todosData) {
        todos = [...todos, todo];
      }

      return todos;
    },
    todo: async (_, { id }) => {
        
      let todo: Todo | undefined = undefined;

      const todosData = await db
        .query(
          aql`
            FOR t IN ${todosCollection}
                FILTER t._key == ${id}
                LIMIT 1
                RETURN MERGE( { id: t._key } , t)
        `
        )
        .catch((err) => {
          throw new Error(err);
        });
      for await (const todoData of todosData) {
        todo = todoData;
      }

      if (!todo) {
        throw new Error("Todo not found!");
      }

      return todo;
    }

  },
  Mutation: {
    createTodo: async (_, { description }) => {
      let todo: Todo | undefined = undefined;
      const todosData = await db
        .query(
          aql`
            INSERT {
                "description": ${description},
                "completed": false
             } INTO ${todosCollection}
            LET t = NEW
            RETURN MERGE( { id: t._key } , t)
        `
        )
        .catch((err) => {
          throw new Error(err);
        });

      for await (const todoData of todosData) {
        todo = todoData;
      }

      if (!todo) {
        throw new Error("Todo not created");
      }

      return todo;
    },
    deleteTodo: async (_, { id }) => {
      let todo: Todo | undefined = undefined;

      const todosData = await db
        .query(
          aql`
            FOR t IN ${todosCollection}
                FILTER t._key == ${id}
                LIMIT 1
                REMOVE t IN ${todosCollection}
                RETURN MERGE( { id: t._key } , t)
        `
        )
        .catch((err) => {
          throw new Error(err);
        });
      for await (const todoData of todosData) {
        todo = todoData;
      }

      if (!todo) {
        throw new Error("Todo not created");
      }

      return todo;
    },
    updateTodo: async (_, { id, description, completed }) => {
      let todo: Todo | undefined = undefined;

      console.log(`
      FOR t IN ${todosCollection}
        FILTER t._key == "${id}"
        UPDATE t._key WITH { completed: ${completed}, description: "${description}" } IN ${todosCollection}
    `);

      const todosData = await db
        .query(
          aql`
          FOR t IN ${todosCollection}
            FILTER t._key == ${id}
            UPDATE t._key WITH { completed: ${completed}, description: ${description} } IN ${todosCollection}
            RETURN MERGE( t, { id: t._key,  completed: ${completed}, description: ${description} })
        `
        )
        .catch((err) => {
          throw new Error(err);
        });
      for await (const todoData of todosData) {
        todo = todoData;
      }

      if (!todo) {
        throw new Error("Todo not created");
      }

      return todo;
    }
  },
};
