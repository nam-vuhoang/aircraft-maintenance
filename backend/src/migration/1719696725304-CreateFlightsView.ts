import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFlightsView1719696725304 implements MigrationInterface {
  name = 'CreateFlightsView1625671234567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE VIEW flights_view AS
        SELECT 
          id,
          COALESCE(actual_departure_time, estimated_departure_time, scheduled_departure_time) AS departure_time,
          COALESCE(actual_arrival_time, estimated_arrival_time, scheduled_arrival_time) AS arrival_time
        FROM flights;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW flights_view`);
  }
}
