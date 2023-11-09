import { DataSource } from "typeorm";
import { Reputation } from "../entity/reputation.entity";

export const reputationProviders = [
  {
    provide: "REPUTATION_REPOSITORY",
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Reputation),
    inject: ["DATA_SOURCE"],
  },
];
