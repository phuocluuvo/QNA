import { Test, TestingModule } from '@nestjs/testing';
import { SysconfigService } from './sysconfig.service';

describe('SysconfigService', () => {
  let service: SysconfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysconfigService],
    }).compile();

    service = module.get<SysconfigService>(SysconfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
