import { aql } from "arangojs";
import { db, dbTodos } from "../db";
import { Resolvers, Todo } from "../generated/graphql";

export const resolvers: Resolvers = {
  Query: {
    todos: async () => {
      let todos: Todo[] = [];
      const todosData = await db
        .query(
          aql`
            FOR t IN ${dbTodos}
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
            FOR t IN ${dbTodos}
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
             } INTO ${dbTodos}
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
            FOR t IN ${dbTodos}
                FILTER t._key == ${id}
                LIMIT 1
                REMOVE t IN ${dbTodos}
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
  },
};
