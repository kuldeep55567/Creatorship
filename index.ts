import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import connection from './Config/Database';
import userRouter from './Routes/UserRoute';
import cors from 'cors';
import * as http from "node:http";
import { ApolloServer } from "@apollo/server";
import mergedTypeDefs from "./typedefs";
import mergedResolvers from "./Resolvers";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
const app = express();

app.use(cors());
app.use(bodyParser.json());

const httpServer = http.createServer(app);

const server = new ApolloServer({
        typeDefs : mergedTypeDefs,
        resolvers : mergedResolvers,
        plugins : ApolloServerPluginDrainHttpServer({ httpServer })
});
    await server.start();


app.use(
    "/graphql",
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
    express.json()
);

await new Promise((resolve) => httpServer.listen({ port: 3000 }, resolve));
await connection


app.listen(3000, async() => {
    try {

        console.log('Database connected');
    } catch (error) {
        console.log('Error connecting to database');
    }
    console.log('Server is running on port 3000');
})