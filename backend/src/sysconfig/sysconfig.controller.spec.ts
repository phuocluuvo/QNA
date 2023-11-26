import { Test, TestingModule } from "@nestjs/testing";
import { SysconfigController } from "./sysconfig.controller";

describe("SysconfigController", () => {
  let controller: SysconfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysconfigController],
    }).compile();

    controller = module.get<SysconfigController>(SysconfigController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
