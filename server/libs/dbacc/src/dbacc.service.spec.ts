import { Test, TestingModule } from '@nestjs/testing';
import { DbaccService } from './dbacc.service';

describe('DbaccService', () => {
  let service: DbaccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbaccService],
    }).compile();

    service = module.get<DbaccService>(DbaccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
