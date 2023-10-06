import { DataSourceOptions } from "typeorm";

export const databaseConfig: DataSourceOptions = {
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: true,
};
