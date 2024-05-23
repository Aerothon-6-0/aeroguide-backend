import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

class SocketService {
    public io: SocketIOServer | undefined;
    private static instance: SocketService;



    public static getInstance(): SocketService {

        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }


    public initialize(server: HTTPServer): void {
        this.io = new SocketIOServer(server, {
            path: '/socket.io', // Specify the path if needed
            cors: {
                origin: '*', // Configure CORS as needed
            },
        });

        this.io.on('connection', this.handleConnection.bind(this));
    }

    private handleConnection(socket: Socket): void {
        console.log('Client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        // Add your custom event handlers here
        socket.on('message', this.handleCustomEvent.bind(this));
    }

    private handleCustomEvent(data: any): void {
        console.log('Received customEvent with data:', data);
        // Handle the received data here
    }

    public emit(event: string, data: any): void {
        this.io?.emit(event, data);
    }
}

export default SocketService.getInstance();
