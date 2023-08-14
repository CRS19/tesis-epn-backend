import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(81, {
  cors: { origin: '*' }, // dominio web
  namespace: 'possibleSickAlert',
})
export class PossibleSickAlertGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}
  private readonly logger = new Logger(PossibleSickAlertGateway.name);
  @WebSocketServer() server: Server;

  afterInit(server: any) {
    this.logger.debug('WS | afterInit method called 🚀');
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.debug(`cliente -> ${client.id}`);
    this.logger.debug('WS | handleConnection method called conectado -> 🔌');
  }
  handleDisconnect(client: any) {
    this.logger.debug('WS | handleDisconnect method called desconectado -> 🚫');
  }

  /*  @SubscribeMessage('elpepeRequest')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    this.logger.debug(`WS | handleEvent method called data -> ${client.id}`);

    this.server.emit('elpepeResponse', 'Hola, soy el servidor');

    return 'lo escuche';
  }*/
}
