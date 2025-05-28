import { Test, TestingModule } from '@nestjs/testing';
import { WebserverController } from './webserver.controller';
import { WebserverService } from './webserver.service';

describe('WebserverController', () => {
  let webserverController: WebserverController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WebserverController],
      providers: [WebserverService],
    }).compile();

    webserverController = app.get<WebserverController>(WebserverController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(webserverController.getHello()).toBe('Hello World!');
    });
  });
});
