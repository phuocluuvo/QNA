import { Test, TestingModule } from "@nestjs/testing";
import { ReputationService } from "./reputation.service";
import { reputationProviders } from "./providers/reputation.providers";
import { DatabaseModule } from "../database/database.module";
import { UsersModule } from "../users/users.module";

describe("ReputationService", () => {
  let service: ReputationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UsersModule],
      providers: [...reputationProviders, ReputationService],
    }).compile();

    service = module.get<ReputationService>(ReputationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
