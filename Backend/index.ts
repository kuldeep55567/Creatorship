import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import connection from './Config/Database';
import userRouter from './Routes/UserRoute';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
})

app.use('/user', userRouter);
app.listen(3000, async() => {
    try {
        await connection;
        console.log('Database connected');
    } catch (error) {
        console.log('Error connecting to database');
    }
    console.log('Server is running on port 3000');
})