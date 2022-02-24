const { readFileSync } = require('fs')

export const typeDefs = readFileSync(`${__dirname}/schema.graphql`).toString('utf-8')