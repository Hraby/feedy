import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { OnModuleInit } from '@nestjs/common';
import { OrdersService } from './orders.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class OrdersGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    constructor(private ordersService: OrdersService) {}

    onModuleInit() {
      this.server.on('connection', (socket) => {
        console.log(socket.id);
        console.log('connected');
      });
    }

    @OnEvent('order.updated')
    handleOrderUpdated(payload: { orderId: string; status: string }) {
      this.server.emit('orderUpdated', payload);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, orderId: string) {
      client.join(orderId);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, orderId: string) {
      client.leave(orderId);
    }
}