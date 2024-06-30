/**
 * The base entity for entities with a duration.
 */
export interface DurationEntity {
  get id(): string;
  get startTime(): Date;
  get endTime(): Date;
}
