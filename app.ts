import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') dotenv.config();
import express, { Express } from 'express';
import * as http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './src/routes';
import { Server as SocketIOServer } from 'socket.io';
import socketService from './src/services/socket-service'



const app: Express = express();
const server =  http.createServer(app)



app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);

const port = process.env.PORT || 8000;

socketService.initialize(server);


app.use(cors());
app.use('/', routes);

setInterval(() => {
  const flightDetails = {
      flightNumber: 'XY123',
      status: 'On Time',
      departure: '10:00 AM',
      arrival: '12:00 PM',
  };
  socketService.emit('routes',flightDetails);
}, 5000);



server.listen(port, () => {
  console.log(`⚡️[socket]: Socket is running at http://localhost:${port}`);
});


