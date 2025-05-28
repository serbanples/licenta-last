import { Test, TestingModule } from '@nestjs/testing';
import { NotificationServerController } from './notification-server.controller';
import { NotificationServerService } from './notification-server.service';

describe('NotificationServerController', () => {
  let notificationServerController: NotificationServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationServerController],
      providers: [NotificationServerService],
    }).compile();

    notificationServerController = app.get<NotificationServerController>(NotificationServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(notificationServerController.getHello()).toBe('Hello World!');
    });
  });
});
