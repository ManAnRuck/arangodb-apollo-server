import {  Database } from "arangojs";


export const db = new Database();
export const dbTodos = db.collection("todos");
