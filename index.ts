import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import connection from './Config/Database.js';
import userRouter from './Routes/UserRoute.js';
import cors from 'cors';
import * as http from "node:http";
import { ApolloServer } from "@apollo/server";
import mergedTypeDefs from "./typedefs";
import mergedResolvers from "./Resolvers";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
const app = express();

app.use(cors());
app.use(bodyParser.json());

interface MyContext {
    token?: String;
}

const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
    typeDefs : mergedTypeDefs,
    resolvers : mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
    await server.start();


app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
    }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connection

console.log("graph ql server up and running at port 4000")
