import { Test, TestingModule } from '@nestjs/testing';
import { MailServerController } from './mail-server.controller';
import { MailServerService } from './mail-server.service';

describe('MailServerController', () => {
  let mailServerController: MailServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MailServerController],
      providers: [MailServerService],
    }).compile();

    mailServerController = app.get<MailServerController>(MailServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mailServerController.getHello()).toBe('Hello World!');
    });
  });
});
