import express from 'express';
import bodyParser from 'body-parser';
import connection from './Config/Database.js';
import cors from 'cors';
import * as http from "node:http";
import { ApolloServer } from "@apollo/server";
import mergedTypeDefs from './typedefs/index.js';
import mergedResolvers from './resolvers/index.js';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from "@apollo/server/express4";
const app = express();
app.use(cors());
app.use(bodyParser.json());
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use("/graphql", cors(), express.json(), expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
}));
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connection;
console.log("graph ql server up and running at port 4000");