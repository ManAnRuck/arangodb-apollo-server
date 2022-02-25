## 🚧 under construction 🚧

#  [ArangoDB](https://www.arangodb.com) + [Apollo Server](https://www.apollographql.com/docs/apollo-server/) (GraphQL)

## Prerequirements

* Docker
* docker-compose
* node
* yarn

## How to run

1. install dependencies `yarn install`
2. run ArangoDB `docker-compose up`
3. in **new terminal** change to apollo directory `cd apollo`
4. generate types `yarn codegen`
5. run apollo server `yarn dev`
6. open and try graphql interface http://localhost:4000/
