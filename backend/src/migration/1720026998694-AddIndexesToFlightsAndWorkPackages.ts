import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesToFlightsAndWorkPackages1720026998694
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE INDEX "IDX_flight_registration" ON "flights" ("registration");
          CREATE INDEX "IDX_flight_airline" ON "flights" ("airline");
          CREATE INDEX "IDX_flight_aircraftType" ON "flights" ("aircraftType");
          CREATE INDEX "IDX_flight_flightNumber" ON "flights" ("flightNumber");
          CREATE INDEX "IDX_flight_scheduledDepartureStation" ON "flights" ("scheduled_departure_station");
          CREATE INDEX "IDX_flight_scheduledArrivalStation" ON "flights" ("scheduled_arrival_station");
    
          CREATE INDEX "IDX_workPackage_registration" ON "work_packages" ("registration");
          CREATE INDEX "IDX_workPackage_station" ON "work_packages" ("station");
          CREATE INDEX "IDX_workPackage_status" ON "work_packages" ("status");
          CREATE INDEX "IDX_workPackage_area" ON "work_packages" ("area");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DROP INDEX "IDX_flight_registration";
          DROP INDEX "IDX_flight_airline";
          DROP INDEX "IDX_flight_aircraftType";
          DROP INDEX "IDX_flight_flightNumber";
          DROP INDEX "IDX_flight_scheduledDepartureStation";
          DROP INDEX "IDX_flight_scheduledArrivalStation";
    
          DROP INDEX "IDX_workPackage_registration";
          DROP INDEX "IDX_workPackage_station";
          DROP INDEX "IDX_workPackage_status";
          DROP INDEX "IDX_workPackage_area";
        `);
  }
}
