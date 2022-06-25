// make unit test for possibleSickAlert.gateway.ts

import { PossibleSickAlertGateway } from './possibleSickAlert.gateway';

describe('PossibleSickAlertGateway', () => {
  it('should be defined', () => {
    const socket = new PossibleSickAlertGateway();

    socket.afterInit({});
    socket.handleConnection({});
    socket.handleDisconnect({});
    expect(socket).toBeDefined();
  });
});
