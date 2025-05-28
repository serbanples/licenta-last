import { Test, TestingModule } from '@nestjs/testing';
import { UploaderServerController } from './uploader-server.controller';
import { UploaderServerService } from './uploader-server.service';

describe('UploaderServerController', () => {
  let uploaderServerController: UploaderServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UploaderServerController],
      providers: [UploaderServerService],
    }).compile();

    uploaderServerController = app.get<UploaderServerController>(UploaderServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(uploaderServerController.getHello()).toBe('Hello World!');
    });
  });
});
