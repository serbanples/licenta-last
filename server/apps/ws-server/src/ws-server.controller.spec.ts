import { Test, TestingModule } from '@nestjs/testing';
import { WsServerController } from './ws-server.controller';
import { WsServerService } from './ws-server.service';

describe('WsServerController', () => {
  let wsServerController: WsServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WsServerController],
      providers: [WsServerService],
    }).compile();

    wsServerController = app.get<WsServerController>(WsServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(wsServerController.getHello()).toBe('Hello World!');
    });
  });
});
