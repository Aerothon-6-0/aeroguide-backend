import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') dotenv.config();
import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './src/routes';

const app: Express = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);

const port = process.env.PORT || 3000;

app.use(cors());
app.use('/', routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
