import { Test, TestingModule } from '@nestjs/testing';
import { AutzServerController } from './autz-server.controller';
import { AutzServerService } from './autz-server.service';

describe('AutzServerController', () => {
  let autzServerController: AutzServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AutzServerController],
      providers: [AutzServerService],
    }).compile();

    autzServerController = app.get<AutzServerController>(AutzServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(autzServerController.getHello()).toBe('Hello World!');
    });
  });
});
