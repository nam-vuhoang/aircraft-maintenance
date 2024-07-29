import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabaseTables1718262622383 implements MigrationInterface {
  name = 'CreateDatabaseTables1718262622383';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "work_packages" ("registration" character varying NOT NULL, "id" character varying NOT NULL, "name" character varying NOT NULL, "station" character varying NOT NULL, "status" character varying NOT NULL, "area" character varying NOT NULL, "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_7ee5049471d751ff51d8e71720f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_43016ba59df8359d36e436c3a9" ON "work_packages" ("registration", "station", "status", "area") `,
    );
    await queryRunner.query(
      `CREATE TABLE "flights" ("registration" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "airline" character varying NOT NULL, "aircraftType" character varying NOT NULL, "flightNumber" character varying NOT NULL, "scheduled_departure_station" character varying NOT NULL, "scheduled_arrival_station" character varying NOT NULL, "scheduled_departure_time" TIMESTAMP WITH TIME ZONE NOT NULL, "scheduled_arrival_time" TIMESTAMP WITH TIME ZONE NOT NULL, "estimated_departure_time" TIMESTAMP WITH TIME ZONE, "estimated_arrival_time" TIMESTAMP WITH TIME ZONE, "actual_departure_time" TIMESTAMP WITH TIME ZONE, "actual_arrival_time" TIMESTAMP WITH TIME ZONE, "departure_stand" character varying, "original_departure_stand" character varying, "arrival_stand" character varying, "original_arrival_stand" character varying, CONSTRAINT "PK_c614ef3382fdd70b6d6c2c8d8dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_90f8ce97196559b19a5107a8e6" ON "flights" ("airline", "registration", "aircraftType", "flightNumber", "scheduled_departure_station", "scheduled_arrival_station") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_90f8ce97196559b19a5107a8e6"`,
    );
    await queryRunner.query(`DROP TABLE "flights"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_43016ba59df8359d36e436c3a9"`,
    );
    await queryRunner.query(`DROP TABLE "work_packages"`);
  }
}
